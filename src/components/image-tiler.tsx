import { cn } from "@/lib/utils";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface ImageTilerProps {
  imageUrl: string;
  tileWidth: number;
  tileHeight: number;
  offsetX: number;
  offsetY: number;
}

export function ImageTiler({
  imageUrl,
  tileWidth,
  tileHeight,
  offsetX,
  offsetY,
}: ImageTilerProps) {
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [selected, setSelected] = useState<{ x: number; y: number }[]>([]);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [graphic, setGraphic] = useState(0);
  const [initialIndex, setInitialIndex] = useState(1);

  const copyToClipboard = useCallback(() => {
    if (!selected.length) {
      toast.error("No hay gráficos seleccionados");
      return;
    }

    const sorted = selected.sort(
      (a, b) => a.x + a.y * imageSize.width - (b.x + b.y * imageSize.width)
    );

    const graphics: Array<
      | {
          type: "graphic";
          index: number;
          x: number;
          y: number;
        }
      | {
          type: "animation";
          index: number;
          graphics: number[];
        }
    > = sorted.map((cell, index) => ({
      type: "graphic",
      index: index + initialIndex,
      x: cell.x,
      y: cell.y,
    }));

    for (const group of Object.values(
      Object.groupBy(
        graphics.filter((line) => line.type === "graphic"),
        (cell) => cell.y
      )
    )) {
      if (!group) return;

      graphics.push({
        type: "animation",
        index: graphics.length + initialIndex,
        graphics: group.map((cell) => cell.index),
      });
    }

    navigator.clipboard
      .writeText(
        graphics
          .map((line) => {
            if (line.type === "graphic") {
              return `Grh${line.index}=1-${graphic}-${line.x}-${line.y}-${tileWidth}-${tileHeight}`;
            }
            return `Grh${line.index}=${
              line.graphics.length
            }-${line.graphics.join("-")}-${animationSpeed}`;
          })
          .join("\n")
      )
      .then(() => toast.success("Copiado al portapapeles"));
  }, [selected, imageSize.width, initialIndex, animationSpeed, graphic, tileWidth, tileHeight]);

  const toggleSelected = useCallback(
    (x: number, y: number) => {
      const selection: typeof selected = [];
      let deleted = false;
      for (const cell of selected) {
        if (cell.x === x && cell.y === y) {
          deleted = true;
          continue;
        }
        selection.push(cell);
      }
      if (!deleted) {
        selection.push({ x, y });
      }
      setSelected(selection);
    },
    [selected, setSelected]
  );

  useEffect(() => {
    setSelected([]);
  }, [imageUrl, tileWidth, tileHeight]);

  // Load image dimensions
  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      setImageSize({ width: img.width, height: img.height });
    };
  }, [imageUrl]);

  const cols = useMemo(
    () => Math.ceil(imageSize.width / tileWidth),
    [imageSize.width, tileWidth]
  );
  const rows = useMemo(
    () => Math.ceil(imageSize.height / tileHeight),
    [imageSize.height, tileHeight]
  );

  if (imageSize.width === 0 || imageSize.height === 0) {
    return <p>Loading image...</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        className="relative overflow-hidden"
        style={{ width: imageSize.width, height: imageSize.height }}
      >
        {/* Background Image */}
        <img
          src={imageUrl}
          alt="Tiled"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        {/* Grid Overlay */}
        {Array.from({ length: rows }).map((_, rowIndex) =>
          Array.from({ length: cols }).map((_, colIndex) => (
            <Cell
              props={{
                x: colIndex * tileWidth + offsetX,
                y: rowIndex * tileHeight + offsetY,
                width: tileWidth,
                height: tileHeight,
                selected,
                toggleSelected,
              }}
            />
          ))
        )}
      </div>
      <div className="flex flex-col items-start justify-start gap-2">
        <Label htmlFor="graphic">Número del Gráfico</Label>
        <Input
          type="number"
          name="graphic"
          id="graphic"
          value={graphic}
          onChange={(e) => setGraphic(e.target.valueAsNumber)}
        />
      </div>
      <div className="flex flex-col items-start justify-start gap-2">
        <Label htmlFor="animationSpeed">Velocidad de Animación</Label>
        <Input
          type="number"
          name="animationSpeed"
          id="animationSpeed"
          value={animationSpeed}
          onChange={(e) =>
            setAnimationSpeed(Math.min(4, Math.max(1, e.target.valueAsNumber)))
          }
        />
      </div>
      <div className="flex flex-col items-start justify-start gap-2">
        <Label htmlFor="initialIndex">Índice Inicial</Label>
        <Input
          type="number"
          name="initialIndex"
          id="initialIndex"
          value={initialIndex}
          onChange={(e) =>
            setInitialIndex(Math.max(1, e.target.valueAsNumber))
          }
        />
      </div>
      <Button onClick={copyToClipboard}>Copiar al portapapeles</Button>
    </div>
  );
}

const Cell = memo(
  ({
    props,
  }: {
    props: {
      x: number;
      y: number;
      width: number;
      height: number;
      selected: { x: number; y: number }[];
      toggleSelected: (x: number, y: number) => void;
    };
  }) => {
    return (
      <div
        className={cn(
          "absolute border border-red-500 hover:bg-red-500/30 cursor-pointer",
          props.selected.find(
            (cell) => cell.x === props.x && cell.y === props.y
          ) && "bg-red-500/30"
        )}
        style={{
          width: props.width,
          height: props.height,
          top: props.y,
          left: props.x,
        }}
        onClick={() => props.toggleSelected(props.x, props.y)}
      />
    );
  }
);

export default ImageTiler;
