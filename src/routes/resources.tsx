import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from "react";
import { Lock, Loader2, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner"; 

// Import your site layout components
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute('/resources')({
  component: ResourcesPage,
})

declare global {
  interface Window {
    Razorpay: any;
  }
}

// Adjust these properties if your Supabase column names are slightly different
interface Resource {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number; 
  is_locked: boolean; // Assuming your DB uses snake_case for columns
}

function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loadingResources, setLoadingResources] = useState(true);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Fetch real data from Supabase when the page loads
  useEffect(() => {
    async function fetchResources() {
      try {
        const { data, error } = await supabase
          .from('resources')
          .select('*')
          .order('created_at', { ascending: false }); // Show newest first

        if (error) throw error;
        
        if (data) {
          setResources(data);
        }
      } catch (error) {
        console.error("Error fetching resources:", error);
        toast.error("Failed to load resources from the database.");
      } finally {
        setLoadingResources(false);
      }
    }

    fetchResources();
  }, []);

  const handleUnlockClick = async (resource: Resource) => {
    setLoadingId(resource.id);

    try {
      const { data, error } = await supabase.functions.invoke("create-razorpay-order", {
        body: { resourceId: resource.id },
      });

      if (error) throw new Error(error.message);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
        amount: data.amount, 
        currency: "INR",
        name: "Mahadevi Computers",
        description: `Unlock: ${resource.title}`,
        order_id: data.orderId, 
        handler: async function (response: any) {
          console.log("Payment Success! ID:", response.razorpay_payment_id);
          toast.success(`Successfully unlocked ${resource.title}!`);
        },
        theme: {
          color: "#0f172a", 
        },
      };

      const rzp = new window.Razorpay(options);
      
      rzp.on("payment.failed", function (response: any) {
        console.error("Payment Failed", response.error);
        toast.error("Payment failed or cancelled. Please try again.");
      });

      rzp.open();
    } catch (err: any) {
      console.error("Error:", err);
      toast.error("Could not start the payment process. Make sure you are logged in.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto py-12">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Premium Resources</h1>
            <p className="text-muted-foreground mt-2">Unlock exclusive courses and materials.</p>
          </div>

          {loadingResources ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading resources...</span>
            </div>
          ) : resources.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <p>No resources have been uploaded yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource) => (
                <Card key={resource.id} className="flex flex-col border-border/50 bg-surface/50">
                  <CardHeader>
                    <CardTitle>{resource.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground mb-4">
                      {resource.description}
                    </p>
                    
                    {resource.is_locked && (
                      <div className="font-semibold text-lg bg-background p-3 rounded-lg border border-border inline-block">
                        ₹{resource.price / 100}
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter>
                    {resource.is_locked ? (
                      <Button 
                        onClick={() => handleUnlockClick(resource)} 
                        disabled={loadingId === resource.id}
                        className="w-full bg-primary text-primary-foreground"
                      >
                        {loadingId === resource.id ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Lock className="w-4 h-4 mr-2" />
                        )}
                        Pay & Unlock
                      </Button>
                  ) : (
  <Button variant="outline" className="w-full" asChild>
    {/* Change resource.id to resource.slug below! */}
    <Link to="/resources/$slug" params={{ slug: resource.slug }}>
      <Unlock className="w-4 h-4 mr-2" />
      View Resource
    </Link>
  </Button>
)}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}