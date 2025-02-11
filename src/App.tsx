import { useState } from "react";
import "./App.css";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import ImageTiler from "./components/image-tiler";

function App() {
  const [image, setImage] = useState<File | undefined>(undefined);
  const [dimensions, setDimensions] = useState({
    width: 32,
    height: 32,
  });

  return (
    <main className="flex flex-col items-center gap-4 justify-center h-screen">
      <div className="relative">
        {image && <ImageTiler imageUrl={URL.createObjectURL(image)} tileWidth={dimensions.width} tileHeight={dimensions.height} />}
      </div>
      <div className="flex flex-col items-start justify-start gap-2">
        <Label htmlFor="file">Image</Label>
        <Input
          type="file"
          name="file"
          id="file"
          onChange={(e) => setImage(e.target.files?.[0])}
        />
      </div>
      <div className="flex flex-row items-start justify-start gap-2">
        <div className="flex flex-col items-start justify-start gap-2">
          <Label htmlFor="width">Width</Label>
          <Input
            type="number"
            name="width"
            id="width"
            value={dimensions.width}
            onChange={(e) =>
              setDimensions({ ...dimensions, width: e.target.valueAsNumber })
            }
          />
        </div>
        <div className="flex flex-col items-start justify-start gap-2">
          <Label htmlFor="height">Height</Label>
          <Input
            type="number"
            name="height"
            id="height"
            value={dimensions.height}
            onChange={(e) =>
              setDimensions({ ...dimensions, height: e.target.valueAsNumber })
            }
          />
        </div>
      </div>
    </main>
  );
}

export default App;
