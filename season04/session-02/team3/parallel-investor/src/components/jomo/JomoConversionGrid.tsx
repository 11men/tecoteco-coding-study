import Card from "@/components/ui/Card";
import { JomoItem } from "@/lib/types";

interface JomoConversionGridProps {
  items: JomoItem[];
}

export default function JomoConversionGrid({ items }: JomoConversionGridProps) {
  if (items.length === 0) {
    return (
      <Card>
        <p className="text-center text-zinc-400 py-12">
          방어 금액이 아직 없습니다.
        </p>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg font-bold">이만큼 살 수 있었어요</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {items.map((item) => (
          <Card key={item.name}>
            <div className="flex flex-col items-center gap-2 py-3">
              <span className="text-4xl">{item.emoji}</span>
              <p className="text-sm text-zinc-500 font-medium">{item.name}</p>
              <p className="text-3xl font-extrabold text-zinc-900">
                {item.quantity}
                <span className="text-base font-medium text-zinc-500 ml-0.5">
                  개
                </span>
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
