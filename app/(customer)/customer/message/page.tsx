// app/(customer)/customer/message/page.tsx
import { Metadata } from "next";
import CustomerMessages from "../../_components/CustomerMessages";


export const metadata: Metadata = {
  title: "My Messages",
  description: "View and manage your messages",
};

export default function MessagePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">My Messages</h1>
      <CustomerMessages />
    </div>
  );
}