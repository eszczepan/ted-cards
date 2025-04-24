import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatePresence, motion } from "framer-motion";
import { SourceType, SOURCE_TYPE } from "@/types";

type SourceTypeSwitcherProps = {
  value: SourceType;
  onChange: (value: SourceType) => void;
};

export function SourceTypeSwitcher({
  value,
  onChange,
}: SourceTypeSwitcherProps) {
  return (
    <Tabs
      value={value}
      onValueChange={onChange as (value: string) => void}
      className="w-full"
    >
      <TabsList className="grid grid-cols-2 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={`tab-${SOURCE_TYPE.YOUTUBE}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <TabsTrigger value={SOURCE_TYPE.YOUTUBE} className="w-full">
              YouTube Link
            </TabsTrigger>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={`tab-${SOURCE_TYPE.TEXT}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <TabsTrigger value={SOURCE_TYPE.TEXT} className="w-full">
              Text Input
            </TabsTrigger>
          </motion.div>
        </AnimatePresence>
      </TabsList>
    </Tabs>
  );
}
