import AccountSidebar from "@/components/account/AccountSidebar";

export default function MyAccountLayout({ children }: LayoutProps<"/my-account">) {
  return (
    <div className="container-page py-8 sm:py-12">
      <div className="grid gap-6 lg:grid-cols-[255px_minmax(0,1fr)]">
        <AccountSidebar />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
