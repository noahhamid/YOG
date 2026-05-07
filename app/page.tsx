import Countdown from "@/components/Countdown";
import Navbar from "@/components/Navbar";
import { div } from "framer-motion/m";

export default function Page() {
  return (
    <div>
      <Navbar />
      <Countdown />
    </div>
  );
}
