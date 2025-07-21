import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import clsx from "clsx";

interface SearchFormProps {
  onSearch: (summonerName: string, tagLine: string, region: string) => void;
  loading?: boolean;
}

const regions = [
  { key: "EUW", label: "Europe West" },
  { key: "NA", label: "North America" },
  { key: "KR", label: "Korea" },
  { key: "EUNE", label: "Europe Nordic & East" },
  { key: "BR", label: "Brazil" },
  { key: "JP", label: "Japan" },
  { key: "LAN", label: "Latin America North" },
  { key: "LAS", label: "Latin America South" },
  { key: "OCE", label: "Oceania" },
  { key: "RU", label: "Russia" },
  { key: "TR", label: "Turkey" },
];

// Schema de validation pour le formulaire original
const SearchFormSchema = z.object({
  summonerNameTag: z
    .string()
    .min(1, "Summoner name and tag are required")
    .regex(/^.+#.+$/, "Format should be: SummonerName#TAG"),
  region: z.string().min(1, "Region is required"),
});

type SearchFormData = z.infer<typeof SearchFormSchema>;

export default function SearchForm({
  onSearch,
  loading = false,
}: SearchFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<SearchFormData>({
    resolver: zodResolver(SearchFormSchema),
    defaultValues: {
      summonerNameTag: "",
      region: "EUW",
    },
  });

  const onSubmit = async (data: SearchFormData) => {
    try {
      // Parse le format "Name#Tag"
      const [name, tag] = data.summonerNameTag.split("#");
      await onSearch(name.trim(), tag.trim(), data.region);
      reset(); // Clear form after successful search
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  const isLoading = loading || isSubmitting;

  // Validation simple pour désactiver le bouton
  const watchedValues = watch();
  const hasValidFormat =
    watchedValues.summonerNameTag.includes("#") &&
    watchedValues.summonerNameTag.trim().length > 2;
  const isButtonDisabled = isLoading || !hasValidFormat;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="bg-gray-900/80 backdrop-blur-lg rounded-xl p-6 border border-gray-700/50">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-lol-gold to-yellow-400 bg-clip-text text-transparent">
              Search Summoner
            </h2>
            <p className="text-gray-400 mt-2">
              Enter summoner name and tag to view detailed statistics
            </p>
          </div>

          {/* Form Fields - Original Layout */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Summoner Name#Tag */}
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Summoner Name#Tag
              </label>
              <Controller
                name="summonerNameTag"
                control={control}
                render={({ field }) => (
                  <div>
                    <input
                      {...field}
                      type="text"
                      placeholder="Faker#T1"
                      className={clsx(
                        "w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400",
                        "focus:ring-2 focus:ring-lol-gold focus:border-transparent transition-all",
                        errors.summonerNameTag
                          ? "border-red-500"
                          : "border-gray-600"
                      )}
                    />
                    {errors.summonerNameTag && (
                      <p className="mt-1 text-sm text-red-400">
                        {errors.summonerNameTag.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            {/* Region Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Region
              </label>
              <Controller
                name="region"
                control={control}
                render={({ field }) => (
                  <div className="relative">
                    <select
                      {...field}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-transparent focus:ring-2 focus:ring-lol-gold focus:border-transparent transition-all appearance-none cursor-pointer"
                    >
                      {regions.map((region) => (
                        <option
                          key={region.key}
                          value={region.key}
                          className="text-white bg-gray-800"
                        >
                          {region.label}
                        </option>
                      ))}
                    </select>
                    {/* Affichage personnalisé de la valeur sélectionnée */}
                    <div className="absolute inset-y-0 left-0 flex items-center px-4 pointer-events-none">
                      <span className="text-white font-medium">
                        {field.value}
                      </span>
                    </div>
                    {/* Icône dropdown */}
                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              />
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isButtonDisabled}
            whileHover={!isButtonDisabled ? { scale: 1.02 } : {}}
            whileTap={!isButtonDisabled ? { scale: 0.98 } : {}}
            className={clsx(
              "w-full bg-gradient-to-r from-lol-gold to-yellow-500 hover:from-yellow-500 hover:to-lol-gold",
              "text-gray-900 font-semibold py-3 px-6 rounded-lg transition-all duration-200",
              "transform active:scale-95",
              isButtonDisabled
                ? "opacity-50 cursor-not-allowed"
                : "hover:shadow-lg hover:shadow-lol-gold/25"
            )}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <motion.svg
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="-ml-1 mr-3 h-5 w-5 text-gray-900"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </motion.svg>
                Searching...
              </span>
            ) : (
              "Search Summoner"
            )}
          </motion.button>

          {/* Quick Tips */}
          <div className="text-center text-sm text-gray-400">
            <p>💡 Example: "Faker#T1" in Korea</p>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
