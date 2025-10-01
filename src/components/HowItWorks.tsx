import React from "react";

export function HowItWorks() {
  return (
    <div className="flex justify-center items-center flex-col px-4 py-20 bg-background">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl tracking-tighter font-geist mx-auto md:text-6xl text-center mb-12 bg-gradient-to-r from-purple-400 to-pink-400 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
          How Surgically AI Works
        </h2>
        
        <div className="space-y-8 text-lg md:text-xl text-foreground/70">
          <p className="text-left">
            Surgically uses{" "}
            <span className="font-bold text-foreground">
              advanced AI models
            </span>{" "}
            to generate realistic surgical simulations in seconds.
          </p>

          <p className="text-left">
            Upload a{" "}
            <span className="font-bold text-foreground">
              patient photo
            </span>
            , select a procedure, and instantly show them{" "}
            <span className="font-bold text-foreground">
              what they'll look like
            </span>{" "}
            after surgery.
          </p>

          <p className="text-left">
            Perfect for plastic surgeons, dermatologists, and aesthetic clinics looking to{" "}
            <span className="font-bold text-foreground">increase consultation conversions</span> and build patient confidence.
          </p>
        </div>
      </div>
    </div>
  );
}
