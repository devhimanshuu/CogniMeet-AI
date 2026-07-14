interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    // Guest call surface is dark, same as the authenticated call view
    <div className="dark h-screen bg-black">
      {children}
    </div>
  );
};

export default Layout;
