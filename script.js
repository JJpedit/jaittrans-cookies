const upload = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const pixelSlider = document.getElementById("pixelSlider");
const qualitySlider = document.getElementById("qualitySlider");

const pixelValue = document.getElementById("pixelValue");
const qualityValue = document.getElementById("qualityValue");

const downloadBtn = document.getElementById("downloadBtn");

let img = null;

upload.addEventListener("change", (e) => {
  const file = e.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    img = new Image();

    img.onload = () => {
      processImage();
    };

    img.src = reader.result;
  };

  reader.readAsDataURL(file);
});

pixelSlider.addEventListener("input", () => {
  pixelValue.textContent = pixelSlider.value;
  processImage();
});

qualitySlider.addEventListener("input", () => {
  qualityValue.textContent = qualitySlider.value;
  processImage();
});

function processImage() {
  if (!img) return;

  const pixelSize = Number(pixelSlider.value);
  const quality = Number(qualitySlider.value);

  canvas.width = img.width;
  canvas.height = img.height;

  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");

  tempCanvas.width = Math.max(1, img.width / pixelSize);
  tempCanvas.height = Math.max(1, img.height / pixelSize);

  tempCtx.imageSmoothingEnabled = false;

  tempCtx.drawImage(
    img,
    0,
    0,
    tempCanvas.width,
    tempCanvas.height
  );

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.imageSmoothingEnabled = quality > 50;

  if (quality > 80) {
    ctx.filter = "contrast(1.1) saturate(1.15)";
  } else if (quality > 50) {
    ctx.filter = "contrast(1.05)";
  } else {
    ctx.filter = "none";
  }

  ctx.drawImage(
    tempCanvas,
    0,
    0,
    canvas.width,
    canvas.height
  );

  ctx.filter = "none";
}

downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");

  link.download = "pixel-restored.png";
  link.href = canvas.toDataURL();

  link.click();
});
