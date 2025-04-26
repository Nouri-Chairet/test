import { TracingBeam } from "@/components/animated/tracing-beam";
import ChallengesList from "@/components/challenges-list";
import transition from "@/components/transition";
import { WavyBackground } from "@/components/wavy-background";
import { Axios } from "@/helpers/axios";
import { Challenge, Domain } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { GoArrowDown } from "react-icons/go";
import { useNavigate, useParams } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import LoadingPageImages from "@/components/LoadingPageImages";
import { Button } from "@/components/ui/button";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";

function Challenges() {
  const navigate = useNavigate();
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const { domainId } = useParams();
  const { data, isLoading, error } = useQuery<Challenge[]>({
    queryKey: ["challenges", domainId],
    queryFn: async (): Promise<Challenge[]> => {
      const { data } = await Axios.get<Challenge[]>(`/domains/${domainId}/challenges`);
      return data;
    },
  });

  const {
    data: domains,
    isLoading: isDomainLoading,
    error: domainError,
  } = useQuery<Domain[]>({
    queryKey: ["domains"],
    queryFn: async (): Promise<Domain[]> => {
      const { data } = await Axios.get<Domain[]>(`/domains`);
      return data;
    },
  });

  const challengesSectionRef = useRef<HTMLDivElement | null>(null);

  function handleGoToChallenges() {
    challengesSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  if (error || domainError) return <div>An Error Occured</div>;

  const domain = domains?.find((d: Domain) => d.id === Number(domainId));

  const challenges = data?.sort((a: Challenge, b: Challenge) => {
    if (sort === "asc") {
      return a.points - b.points;
    } else {
      return b.points - a.points;
    }
  });

  return (
    <>
      <AnimatePresence>
        {(isLoading || isDomainLoading) && (
          <motion.div
            key="loading"
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.3 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
            }}
          >
            <LoadingPageImages />
          </motion.div>
        )}
      </AnimatePresence>
      <WavyBackground className="mx-auto flex h-full w-full flex-col items-center justify-center pb-24">
        <p className="text-center font-mulish text-4xl font-bold text-white md:text-5xl lg:text-7xl">
          Weclome To {domain?.name}
        </p>
        <div
          onClick={handleGoToChallenges}
          className="mt-4 flex flex-col items-center justify-center"
        >
          <motion.button
            whileHover={{
              scale: 1.1,
              backgroundColor: "white",
              color: "black",
            }}
            whileTap={{ scale: 0.9 }}
            className="group mt-10 flex items-center rounded-md bg-black px-4 py-2 font-bold text-white"
          >
            Start Solving
            <div className="ml-2">
              <GoArrowDown className="size-4 text-white transition-all group-hover:translate-y-1 group-hover:text-black" />
            </div>
          </motion.button>
        </div>
        <div
          className="absolute left-4 top-4 flex flex-col items-center justify-center"
          onClick={() => {
            navigate(-1);
          }}
        >
          <motion.button
            initial={{
              backgroundColor: "white",
              color: "black",
            }}
            whileHover={{
              scale: 1.1,
            }}
            whileTap={{ scale: 0.9 }}
            className="group flex items-center self-center rounded-full bg-white px-4 py-2 font-bold text-black"
          >
            <GoArrowLeft className="size-5" />
          </motion.button>
        </div>
      </WavyBackground>
      <TracingBeam className="flex h-full w-full flex-col p-4">
        <div className="flex w-full items-center justify-end">
          <Button
            onClick={() => setSort(sort === "asc" ? "desc" : "asc")}
            className="flex items-center gap-2"
          >
            Points{" "}
            {sort === "asc" ? (
              <IoMdArrowDropup className="size-5" />
            ) : (
              <IoMdArrowDropdown className="size-5" />
            )}
          </Button>
        </div>
        <div className="w-full flex-1" ref={challengesSectionRef}>
          {!isLoading && <ChallengesList challenges={challenges} />}
        </div>
        <div className="mt-20 flex items-center justify-center  py-10">
          <h2>
            Made With ❤️ by{" "}
            <span className="font-medium">Microsoft Issatso</span>
          </h2>
        </div>
      </TracingBeam>
    </>
  );
}

const ChallengesTransitioned = transition(Challenges);
export default ChallengesTransitioned;
