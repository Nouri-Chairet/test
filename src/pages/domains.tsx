import { HoverEffect } from "@/components/animated/card-hover-effect";
import LoadingPageImages from "@/components/LoadingPageImages";
import transition from "@/components/transition";
import { Axios } from "@/helpers/axios";
import { Domain } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { GoArrowLeft } from "react-icons/go";
import { useNavigate } from "react-router-dom";

function Domains() {
  const navigate = useNavigate();
  const {
    data: domains,
    isLoading,
    error,
  } = useQuery<Domain[]>({
    queryKey: ["domains"],
    queryFn: async () => {
      const { data } = await Axios.get<Domain[]>("/domains");
      return data;
    },
  });

  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <AnimatePresence>
        {isLoading && (
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
      {!isLoading && (
        <div className="flex min-h-full w-full flex-col bg-black">
          <div
            className="m-4 flex flex-col items-center justify-center self-start"
            onClick={() => {
              navigate("/");
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
          <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-8">
            {domains && <HoverEffect items={domains} />}
          </div>
        </div>
      )}
    </>
  );
}

const DomainsTransitioned = transition(Domains);
export default DomainsTransitioned;
