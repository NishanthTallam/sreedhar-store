import { notFound } from "next/navigation";

const policies: Record<string, { title: string; content: React.ReactNode }> = {
  "privacy": {
    title: "Privacy Policy",
    content: (
      <div className="space-y-4 text-surface-600">
        <p>This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from General Store.</p>
        <h3 className="text-lg font-bold text-surface-900 mt-6">Personal Information We Collect</h3>
        <p>When you visit the Site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device.</p>
      </div>
    )
  },
  "terms": {
    title: "Terms and Conditions",
    content: (
      <div className="space-y-4 text-surface-600">
        <p>These terms and conditions outline the rules and regulations for the use of General Store's Website.</p>
        <h3 className="text-lg font-bold text-surface-900 mt-6">License</h3>
        <p>Unless otherwise stated, General Store and/or its licensors own the intellectual property rights for all material on General Store. All intellectual property rights are reserved.</p>
      </div>
    )
  },
  "returns": {
    title: "Return & Refund Policy",
    content: (
      <div className="space-y-4 text-surface-600">
        <p>Thank you for shopping at General Store. If you are not entirely satisfied with your purchase, we're here to help.</p>
        <h3 className="text-lg font-bold text-surface-900 mt-6">Returns</h3>
        <p>You have 3 calendar days to return an item from the date you received it. To be eligible for a return, your item must be unused and in the same condition that you received it.</p>
      </div>
    )
  },
  "shipping": {
    title: "Shipping Policy",
    content: (
      <div className="space-y-4 text-surface-600">
        <p>All orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or holidays.</p>
        <h3 className="text-lg font-bold text-surface-900 mt-6">Shipping Rates</h3>
        <p>Shipping charges for your order will be calculated and displayed at checkout.</p>
      </div>
    )
  }
};

export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const policy = policies[slug];

  if (!policy) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 space-y-8">
      <div className="border-b border-surface-200 pb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-surface-900">{policy.title}</h1>
        <p className="text-surface-500 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
      
      <div className="prose prose-surface max-w-none">
        {policy.content}
      </div>
    </div>
  );
}