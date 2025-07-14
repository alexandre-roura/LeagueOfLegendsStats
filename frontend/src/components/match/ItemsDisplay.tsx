import type { ParticipantDto } from "../../types/Match";

interface ItemsDisplayProps {
  participant: ParticipantDto;
}

export default function ItemsDisplay({ participant }: ItemsDisplayProps) {
  const getItemImageUrl = (itemId: number) => {
    if (itemId === 0) return "";
    return `https://ddragon.leagueoflegends.com/cdn/14.24.1/img/item/${itemId}.png`;
  };

  const mainItems = [
    participant.item0,
    participant.item1,
    participant.item2,
    participant.item3,
    participant.item4,
    participant.item5,
  ];

  const trinket = participant.item6;

  return (
    <div className="flex items-center space-x-2">
      {/* Main items grid (2 rows of 3) */}
      <div className="grid grid-cols-3 gap-1">
        {mainItems.map((itemId, index) => (
          <div
            key={index}
            className="w-7 h-7 bg-gray-700 rounded border border-gray-600"
          >
            {itemId > 0 && (
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
        {trinket > 0 && (
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
