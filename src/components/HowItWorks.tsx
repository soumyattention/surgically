import { LinkPreview } from "@/components/ui/link-preview";

export function HowItWorks() {
  return (
    <div className="flex justify-center items-center flex-col px-4 py-20 bg-background">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-300 dark:to-orange-200 bg-clip-text text-transparent">
          How Surgically AI Works
        </h2>
        
        <div className="space-y-8 text-lg md:text-xl text-foreground/70">
          <p className="text-left">
            Surgically uses{" "}
            <LinkPreview
              url="https://openai.com/research/gpt-4"
              className="font-bold bg-clip-text text-transparent bg-gradient-to-br from-primary to-primary-glow"
            >
              advanced AI models
            </LinkPreview>{" "}
            to generate realistic surgical simulations in seconds.
          </p>

          <p className="text-left">
            Upload a{" "}
            <LinkPreview
              url="https://www.example.com/patient-photo"
              imageSrc="https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=640&q=80"
              isStatic
              className="font-bold text-primary"
            >
              patient photo
            </LinkPreview>
            , select a procedure, and instantly show them{" "}
            <LinkPreview
              url="https://www.example.com/results"
              imageSrc="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=640&q=80"
              isStatic
              className="font-bold text-primary"
            >
              what they'll look like
            </LinkPreview>{" "}
            after surgery.
          </p>

          <p className="text-left">
            Perfect for plastic surgeons, dermatologists, and aesthetic clinics looking to{" "}
            <span className="font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">increase consultation conversions</span> and build patient confidence.
          </p>
        </div>
      </div>
    </div>
  );
}
