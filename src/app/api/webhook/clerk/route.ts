import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { db } from '@/db'
import { user } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { polarClient } from '@/lib/polar'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  const headerPayload = await headers()
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }

  const payload = await req.json()
  const body = JSON.stringify(payload)

  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occured', {
      status: 400
    })
  }

  const eventType = evt.type

  if (eventType === 'user.created') {
    const { id, first_name, last_name, image_url, email_addresses } = evt.data
    const name = `${first_name || ''} ${last_name || ''}`.trim() || 'User'
    const email = email_addresses[0]?.email_address

    await db.insert(user).values({
      id,
      name,
      email: email || '',
      image: image_url,
      emailVerified: true,
    })

    if (email) {
      try {
        await polarClient.customers.create({
          email: email,
          name: name,
          externalId: id,
        })
      } catch (error) {
        console.error('Failed to create polar customer:', error)
      }
    }
  }

  if (eventType === 'user.updated') {
    const { id, first_name, last_name, image_url, email_addresses } = evt.data
    const name = `${first_name || ''} ${last_name || ''}`.trim() || 'User'
    const email = email_addresses[0]?.email_address

    await db.update(user).set({
      name,
      email: email || '',
      image: image_url,
      updatedAt: new Date()
    }).where(eq(user.id, id))
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data
    if (id) {
      await db.delete(user).where(eq(user.id, id))
    }
  }

  return new Response('', { status: 200 })
}
