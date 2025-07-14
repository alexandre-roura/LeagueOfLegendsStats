import type { ParticipantDto } from "../../types/Match";
import { useItemImageUrl } from "../../hooks/useItemImageUrl";

interface ItemsDisplayProps {
  participant: ParticipantDto;
  gameVersion?: string;
}

export default function ItemsDisplay({ participant, gameVersion }: ItemsDisplayProps) {
  const { getItemImageUrl, isValidItemId, getParticipantItems } = useItemImageUrl(gameVersion);

  const participantItems = getParticipantItems(participant);
  const mainItems = participantItems.slice(0, 6); // Items 0-5
  const trinket = participantItems[6]; // Item 6

  return (
    <div className="flex items-center space-x-2">
      {/* Main items grid (2 rows of 3) */}
      <div className="grid grid-cols-3 gap-1">
        {mainItems.map((itemId, index) => (
          <div
            key={index}
            className="w-7 h-7 bg-gray-700 rounded border border-gray-600"
          >
            {isValidItemId(itemId) && (
              <img
                src={getItemImageUrl(itemId)}
                alt={`Item ${itemId}`}
                className="w-full h-full rounded object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Trinket */}
      <div className="w-7 h-7 bg-gray-700 rounded border border-gray-600">
        {isValidItemId(trinket) && (
          <img
            src={getItemImageUrl(trinket)}
            alt={`Trinket ${trinket}`}
            className="w-full h-full rounded object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        )}
      </div>
    </div>
  );
}
