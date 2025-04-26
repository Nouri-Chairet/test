import { TracingBeam } from "@/components/animated/tracing-beam";
import { LeaderboardTeam } from "@/components/leaderboard-team";
import transition from "@/components/transition";
import { Axios } from "@/helpers/axios";
import { Leaderboard } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Reorder } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import { motion } from "framer-motion";
import clsx from "clsx";

function LeaderboardPage() {
  const [isFrozen, setIsFrozen] = useState(false);

  const navigate = useNavigate();
  const { data, error, isLoading } = useQuery<Leaderboard>({
    enabled: !isFrozen,
    queryKey: ["leaderboard"],
    queryFn: async (): Promise<Leaderboard> => {
      const response = await Axios.get<Leaderboard>("/public-leaderboard");
      return response.data;
    },
    refetchInterval: 5000,
  });

  useEffect(() => {
    if ((error as any)?.response?.status === 400) {
      setIsFrozen(true);
    } else {
      setIsFrozen(false);
    }
  }, [error]);

  const sortedLeaderboard = React.useMemo(() => {
    const sorted = data?.sort((a: Leaderboard[number], b: Leaderboard[number]) => b.score - a.score);
    if (data && Array.isArray(data)) {
      localStorage.setItem("leaderboard", JSON.stringify(sorted));
    }
    return sorted;
  }, [data]);

  const leaderboard =
    sortedLeaderboard ||
    JSON.parse(localStorage.getItem("leaderboard") || "[]");

  return (
    <>
      <div
        className="absolute left-4 top-4 flex flex-col items-center justify-center"
        onClick={() => {
          navigate("/");
        }}
      >
        <motion.button
          initial={{
            backgroundColor: "black",
            color: "white",
          }}
          whileHover={{
            scale: 1.1,
          }}
          whileTap={{ scale: 0.9 }}
          className="group z-[99] flex items-center self-center rounded-full bg-black px-4 py-2 font-bold text-white"
        >
          <GoArrowLeft className="size-5" />
        </motion.button>
      </div>
      <TracingBeam>
        <div
          className={clsx(
            "mx-auto w-full p-4 font-mulish md:max-w-5xl md:p-2",
            {
              "pointer-events-none opacity-60 grayscale": isFrozen,
            },
          )}
        >
          <div className="my-5 mb-6">
            <h2 className=" flex-1 py-10 text-center text-4xl font-bold xl:text-5xl">
              The Maze Leaderboard
            </h2>
          </div>
          {error && !isFrozen ? (
            <div className="flex h-full items-center justify-center">
              <h3>Error while getting leaderboard</h3>
            </div>
          ) : isLoading ? (
            <div className="flex h-full items-center justify-center">
              Loading Leaderboard...
            </div>
          ) : leaderboard?.length === 0 ? (
            isFrozen ? (
              <div className="my-10 flex h-full items-center justify-center">
                <h3>Leaderboard is Frozen, Work harder!</h3>
              </div>
            ) : (
              <div className="my-10 flex h-full items-center justify-center">
                <h3>No Leaderboard Teams</h3>
              </div>
            )
          ) : (
            <ul className="space-y-4 px-0 md:px-6">
              <Reorder.Group
                as="div"
                draggable={false}
                // dragControls={false}
                dragListener={false}
                axis="y"
                values={sortedLeaderboard || []}
                onReorder={() => {}}
              >
                {leaderboard?.map((team: Leaderboard[number], index: number) => {
                  return (
                    <Reorder.Item
                      key={team?.id}
                      as="div"
                      dragListener={false}
                      draggable={false}
                      value={team}
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          transition: {
                            delay: 0.15 * index,
                            duration: 0.3,
                          },
                        }}
                      >
                        <LeaderboardTeam
                          isFirst={index === 0 && team?.score > 0}
                          isSecond={index === 1 && team?.score > 0}
                          isThird={index === 2 && team?.score > 0}
                          team={team}
                        />
                      </motion.div>
                    </Reorder.Item>
                  );
                })}
              </Reorder.Group>
            </ul>
          )}
        </div>
      </TracingBeam>
    </>
  );
}
const LeaderboardPageTransitionned = transition(LeaderboardPage);
export default LeaderboardPageTransitionned;
