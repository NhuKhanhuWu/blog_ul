/** @format */
import { useState } from "react";
import Cropper, { Area, Point } from "react-easy-crop";
import { IoClose } from "react-icons/io5";
import styles from "./UpdateProfileForm.module.scss";

interface CropAvatarModalProps {
  imageUrl: string;
  onCancel: () => void;
  onSubmit: (area: Area) => void;
}

const CropAvatarModal = ({
  imageUrl,
  onCancel,
  onSubmit,
}: CropAvatarModalProps) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  return (
    <div className={styles.stepOverlay}>
      <section
        className={`${styles.stepModal} ${styles.cropModal}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="crop-avatar-title">
        <header className={styles.header}>
          <h2 id="crop-avatar-title">Crop avatar</h2>
          <button
            type="button"
            className={styles.closeButton}
            aria-label="Close"
            onClick={onCancel}>
            <IoClose />
          </button>
        </header>

        <div className={styles.cropArea}>
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, area) => setCroppedAreaPixels(area)}
          />
        </div>

        <label className={styles.zoomControl}>
          Zoom
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(event) => setZoom(Number(event.target.value))}
          />
        </label>

        <footer className={styles.footer}>
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-primary"
            disabled={!croppedAreaPixels}
            onClick={() => croppedAreaPixels && onSubmit(croppedAreaPixels)}>
            Submit
          </button>
        </footer>
      </section>
    </div>
  );
};

export default CropAvatarModal;
