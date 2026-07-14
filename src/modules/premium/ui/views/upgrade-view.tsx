"use client";

import { useSuspenseQuery, useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";

import { PricingCard } from "../components/pricing-card";

export const UpgradeView = () => {
  const trpc = useTRPC();

  const checkoutMutation = useMutation({
    ...trpc.premium.createCheckout.mutationOptions(),
    onSuccess: (url) => {
      window.location.href = url;
    }
  });

  const portalMutation = useMutation({
    ...trpc.premium.createPortalSession.mutationOptions(),
    onSuccess: (url) => {
      window.location.href = url;
    }
  });

   const { data: products } = useSuspenseQuery(
    trpc.premium.getProducts.queryOptions()
  );

  const { data: currentSubscription } = useSuspenseQuery(
    trpc.premium.getCurrentSubscription.queryOptions()
  );

  return (
    <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-10">
      <div className="mt-4 flex-1 flex flex-col gap-y-10 items-center">
        <h5 className="font-medium text-2xl md:text-3xl">
          You are on the{" "}
          <span className="font-semibold text-primary">
            {currentSubscription?.name ?? "Free"}
          </span>{" "}
          plan
        </h5>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((product) => {
            const isCurrentProduct = currentSubscription?.id === product.id;
            const isPremium = !!currentSubscription;

            let buttonText = "Upgrade";
            let onClick = () => checkoutMutation.mutate({ productId: product.id });

            if (isCurrentProduct) {
              buttonText = "Manage";
              onClick = () => portalMutation.mutate();
            } else if (isPremium) {
              buttonText = "Change Plan";
              onClick = () => portalMutation.mutate();
            }

            const price = product.prices[0];

            return (
              <PricingCard
                key={product.id}
                buttonText={buttonText}
                onClick={onClick}
                variant={
                  product.metadata.variant === "highlighted"
                    ? "highlighted"
                    : "default"
                }
                title={product.name}
                price={
                  price?.amountType === "fixed"
                    ? price.priceAmount / 100
                    : 0
                }
                description={product.description}
                priceSuffix={price ? `/${price.recurringInterval}` : ""}
                features={product.benefits.map(
                  (benefit) => benefit.description
                )}
                badge={
                  typeof product.metadata.badge === "string"
                    ? product.metadata.badge
                    : null
                }
              />
            )
          })}
        </div>
      </div>
    </div>
  );
};

export const UpgradeViewLoading = () => {
  return (
    <LoadingState title="Loading" description="This may take a few seconds" />
  );
};

export const UpgradeViewError = () => {
  return <ErrorState title="Error" description="Please try again later" />;
};
