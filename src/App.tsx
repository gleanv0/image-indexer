import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import ImageTiler from "./components/image-tiler";
import { ModeToggle } from "./components/mode-toggle";

function App() {
  const [image, setImage] = useState<File | undefined>(undefined);
  const [dimensions, setDimensions] = useState({
    width: 32,
    height: 32,
    offsetX: 0,
    offsetY: 0,
  });

  return (
    <main className="relative flex flex-col items-center gap-4 justify-center max-h-screen h-screen">
      <ModeToggle className="absolute top-4 right-4" />
      <div className="relative">
        {image && (
          <ImageTiler
            imageUrl={URL.createObjectURL(image)}
            tileWidth={dimensions.width}
            tileHeight={dimensions.height}
            offsetX={dimensions.offsetX}
            offsetY={dimensions.offsetY}
          />
        )}
      </div>
      <div className="grid grid-rows-2 gap-2">
        <div className="flex flex-col items-start justify-start gap-2">
          <Label htmlFor="file">Image</Label>
          <Input
            type="file"
            name="file"
            id="file"
            onChange={(e) => setImage(e.target.files?.[0])}
          />
        </div>
        <div className="flex flex-row items-center w-full gap-2">
          <div className="flex flex-col items-start justify-start gap-2">
            <Label htmlFor="width">Ancho</Label>
            <Input
              type="number"
              name="width"
              id="width"
              value={dimensions.width}
              onChange={(e) =>
                setDimensions({
                  ...dimensions,
                  width: Math.max(4, e.target.valueAsNumber),
                })
              }
            />
          </div>
          <div className="flex flex-col items-start justify-start gap-2">
            <Label htmlFor="height">Alto</Label>
            <Input
              type="number"
              name="height"
              id="height"
              value={dimensions.height}
              onChange={(e) =>
                setDimensions({
                  ...dimensions,
                  height: Math.max(4, e.target.valueAsNumber),
                })
              }
            />
          </div>
        </div>
        <div className="flex flex-row items-center w-full gap-2">
          <div className="flex flex-col items-start justify-start gap-2">
            <Label htmlFor="offset-x">Offset X</Label>
            <Input
              type="number"
              name="offset-x"
              id="offset-x"
              value={dimensions.offsetX}
              onChange={(e) =>
                setDimensions({
                  ...dimensions,
                  offsetX: e.target.valueAsNumber,
                })
              }
            />
          </div>
          <div className="flex flex-col items-start justify-start gap-2">
            <Label htmlFor="offset-y">Offset Y</Label>
            <Input
              type="number"
              name="offset-y"
              id="offset-y"
              value={dimensions.offsetY}
              onChange={(e) =>
                setDimensions({
                  ...dimensions,
                  offsetY: e.target.valueAsNumber,
                })
              }
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
