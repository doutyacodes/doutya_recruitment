import { Nunito } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { StoreProvider } from "./StoreProvider";
import GlobalProvider from "./QuizProvider";
import { usePathname } from "next/navigation";
const nunito = Nunito({ subsets: ["latin"] });
export const metadata = {
  title: "Doutya Recruit",
  description:
    "At Doutya Recruit, we revolutionize the hiring process by focusing on real skills over traditional resumes. Our innovative recruitment platform presents candidates with tailored quizzes that simulate the challenges they'll face in the job. Instead of reviewing portfolios and past experience, we evaluate applicants based on their performance in these quizzes, ensuring that only the most capable and qualified individuals advance. Join us in transforming the way talent is discovered and hired—proving that actions speak louder than words.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={nunito.className}>
        <StoreProvider>
          <GlobalProvider>{children}</GlobalProvider>
        </StoreProvider>

        <Toaster />
      </body>
    </html>
  );
}
