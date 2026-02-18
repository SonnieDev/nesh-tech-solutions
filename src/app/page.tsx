
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ShieldCheck, Truck, RotateCcw, Star } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-black text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* Placeholder for a cool background image or gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black opacity-90"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=2881&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
        </div>

        <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center text-center space-y-6">
          <Badge className="bg-primary/20 text-primary hover:bg-primary/30 text-sm px-4 py-1 mb-4 border-primary/50">
            Official Spigen Retailer
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            Protect Your Tech <br className="hidden md:inline" /> in Style.
          </h1>
          <p className="max-w-[700px] text-gray-400 md:text-xl/relaxed lg:text-2xl/relaxed">
            Premium Spigen cases for iPhone and Samsung. Experience the Teardown aesthetic with ZeroOne.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button asChild size="lg" className="text-lg px-8 h-14 rounded-full">
              <Link href="/shop">
                Shop Cases <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 h-14 rounded-full border-white/20 hover:bg-white/10 text-white">
              <Link href="/shop?brand=iPhone">
                Shop iPhone
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-muted/50">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <ShieldCheck className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold">Military-Grade Protection</h3>
              <p className="text-muted-foreground">Certified drop protection to keep your device safe from everyday accidents.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-muted/50">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <Truck className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold">Fast Delivery</h3>
              <p className="text-muted-foreground">Quick and reliable shipping to get your case to you as soon as possible.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-muted/50">
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <Star className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold">Official Retailer</h3>
              <p className="text-muted-foreground">Guaranteed authentic Spigen products directly from the source.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6 flex flex-col items-center text-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">Ready to upgrade your protection?</h2>
          <p className="max-w-[600px] text-primary-foreground/80 md:text-xl">
            Join thousands of satisfied customers who trust Nesh Tech for their device protection.
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg px-8 h-14 rounded-full mt-4">
            <Link href="/shop">
              Shop Now
            </Link>
          </Button>
        </div>
      </section>

    </div>
  );
}
