import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { cmnApi } from "@/utils/cmnapi";
import { toast } from "react-hot-toast";
import imageCompression from "browser-image-compression";

const categories = [
  "My City",
  "My Gujarat",
  "Cricket",
  "Entertainment",
  "India",
  "Sport",
  "World",
  "Technology",
  "Lifestyle",
  "Business",
];

const News = ({ type }) => {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);

  // ── Story News states ─────────────────────────────────────────────
  const [storyTitle, setStoryTitle] = useState("");
  const [storyCategory, setStoryCategory] = useState("");
  const [storyShortDesc, setStoryShortDesc] = useState("");
  const [storyFullContext, setStoryFullContext] = useState("");
  const [storyMediaFiles, setStoryMediaFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [storyState, setStoryState] = useState("");
  const [storyCity, setStoryCity] = useState("");

  // ── Digital News states ───────────────────────────────────────────
  const [digitalTitle, setDigitalTitle] = useState("");
  const [digitalCategory, setDigitalCategory] = useState("");
  const [digitalAnchor, setDigitalAnchor] = useState("");
  const [digitalShortDesc, setDigitalShortDesc] = useState(""); // ✅ script → TTS
  const [digitalVideo, setDigitalVideo] = useState(null);
  const [digitalState, setDigitalState] = useState("");
  const [digitalCity, setDigitalCity] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ loading state

  // ── Logout ────────────────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem("userToken");
    router.push("/login");
  };

  // ── Image handler (Story News) ────────────────────────────────────
  const handleImage = async (files) => {
    if (!files || files.length === 0) return;

    const validTypes = ["image/png", "image/jpg", "image/jpeg"];
    const fileArray = Array.from(files);

    for (const file of fileArray) {
      if (!validTypes.includes(file.type)) {
        toast.error("Only PNG, JPG, JPEG files are allowed!");
        return;
      }

      try {
        const options = {
          maxSizeMB: 0.3,
          maxWidthOrHeight: 1200,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);
        setStoryMediaFiles((prev) => [...prev, compressedFile]);
        setImagePreview((prev) => [
          ...prev,
          URL.createObjectURL(compressedFile),
        ]);
      } catch (error) {
        console.error(error);
        toast.error("Image compression failed!");
      }
    }
  };

  // ── Video handler (Digital News) ──────────────────────────────────
  const handleDigitalVideo = (file) => {
    if (!file) return;
    if (file.type !== "video/mp4") {
      toast.error("Only MP4 video files are allowed!");
      return;
    }
    setDigitalVideo(file);
  };

  // ── Publish Story News ────────────────────────────────────────────
  const handlePublishStory = async () => {
    if (!storyTitle) return toast.error("Please enter the story title!");
    if (!storyFullContext)
      return toast.error("Please enter the full story content!");
    if (!storyCategory) return toast.error("Please select a story category!");
    if (storyCategory === "My City") {
      if (!storyState) return toast.error("Please enter state!");
      if (!storyCity) return toast.error("Please enter city!");
    }

    try {
      const formData = new FormData();
      formData.append("title", storyTitle);
      formData.append("shortDescription", storyShortDesc);
      formData.append("fullContext", storyFullContext);
      formData.append("category", storyCategory);
      if (storyCategory === "My City") {
        formData.append("state", storyState);
        formData.append("city", storyCity);
      }
      storyMediaFiles.forEach((file) => formData.append("mediaFiles", file));

      await cmnApi.post("/api/story-news/create", formData);
      toast.success("🚀 Story published successfully!");

      // Reset
      setStoryTitle("");
      setStoryShortDesc("");
      setStoryFullContext("");
      setStoryCategory("");
      setStoryMediaFiles([]);
      setImagePreview([]);
      setStoryState("");
      setStoryCity("");
    } catch (error) {
      console.error("Failed to publish story:", error);
      toast.error("Failed to publish story!");
    }
  };

  // ── Publish Digital News ──────────────────────────────────────────
  const handlePublishDigital = async () => {
    // ✅ Validation
    if (!digitalTitle) return toast.error("Please enter digital news title!");
    if (!digitalCategory) return toast.error("Please select category!");
    if (!digitalAnchor) return toast.error("Please enter anchor name!");
    if (!digitalShortDesc) return toast.error("Please enter news script!");
    if (!digitalVideo) return toast.error("Please upload a video!");
    if (digitalCategory === "My City") {
      if (!digitalState) return toast.error("Please enter state!");
      if (!digitalCity) return toast.error("Please enter city!");
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("title", digitalTitle);
      formData.append("category", digitalCategory);
      formData.append("anchorName", digitalAnchor);

      // ✅ FIX: field name matches backend DTO — "shortDescription" not "fullContext"
      formData.append("shortDescription", digitalShortDesc);

      if (digitalCategory === "My City") {
        formData.append("state", digitalState);
        formData.append("city", digitalCity);
      }

      // ✅ Send video as mediaFiles array entry
      formData.append("mediaFiles", digitalVideo);

      await cmnApi.post("/api/digital-news/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("🎬 Digital news submitted! Video processing started...");

      // Reset
      setDigitalTitle("");
      setDigitalCategory("");
      setDigitalAnchor("");
      setDigitalShortDesc("");
      setDigitalVideo(null);
      setDigitalState("");
      setDigitalCity("");
    } catch (error) {
      console.error("Failed to publish digital news:", error);
      toast.error("Failed to publish digital news!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Shared category renderer ──────────────────────────────────────
  const renderCategories = (selectedCategory, setSelectedCategory) => (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setSelectedCategory(cat)}
          className={`px-4 py-2 rounded-full border font-medium transition ${
            selectedCategory === cat
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-blue-100"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );

  // ── Drag & Drop handlers ──────────────────────────────────────────
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleImage(e.dataTransfer.files);
  };
  const removeImage = (index) => {
    setStoryMediaFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
  };
  const handleClickUpload = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  // ─────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────
  return (
    <div className="bg-white border border-blue-100 rounded-2xl p-8 shadow-lg relative">
      {/* Logout */}
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition cursor-pointer"
      >
        🔒 Logout
      </button>

      {/* ── STORY NEWS ─────────────────────────────────────────────── */}
      {type === "story" && (
        <>
          <h2 className="text-2xl font-bold text-blue-700 mb-4">
            📰 Story News
          </h2>

          <label className="block mb-2 font-semibold text-gray-700">
            Category
          </label>
          {renderCategories(storyCategory, setStoryCategory)}

          <input
            type="text"
            value={storyTitle}
            onChange={(e) => setStoryTitle(e.target.value)}
            placeholder="Enter story news title"
            className="w-full rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-4 mb-6"
          />

          {storyCategory === "My City" && (
            <>
              <input
                type="text"
                value={storyState}
                onChange={(e) => setStoryState(e.target.value)}
                placeholder="Enter state"
                className="w-full rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-4 mb-6"
              />
              <input
                type="text"
                value={storyCity}
                onChange={(e) => setStoryCity(e.target.value)}
                placeholder="Enter city"
                className="w-full rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-4 mb-6"
              />
            </>
          )}

          <textarea
            rows="3"
            value={storyShortDesc}
            onChange={(e) => setStoryShortDesc(e.target.value)}
            placeholder="Enter short description"
            className="w-full rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-4 mb-6"
          />

          <textarea
            rows="5"
            value={storyFullContext}
            onChange={(e) => setStoryFullContext(e.target.value)}
            placeholder="Write full story news description..."
            className="w-full rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 p-4 mb-6"
          />

          <div
            className="mb-6 border-2 border-dashed border-blue-300 rounded-xl p-6 text-center cursor-pointer hover:bg-blue-50 transition"
            onClick={handleClickUpload}
            onDragOver={handleDragOver}
            onDragEnter={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpg, image/jpeg"
              multiple
              hidden
              onChange={(e) => handleImage(e.target.files)}
            />
            {imagePreview.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-4">
                {imagePreview.map((src, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={src}
                      alt={`Preview ${idx}`}
                      className="w-40 h-40 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(idx);
                      }}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-blue-600 font-semibold">
                Drag & drop image here or click to upload
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              onClick={handlePublishStory}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition shadow-md cursor-pointer"
            >
              🚀 Publish Story
            </button>
          </div>
        </>
      )}

      {/* ── DIGITAL NEWS ───────────────────────────────────────────── */}
      {type === "digital" && (
        <>
          <h2 className="text-2xl font-bold text-green-700 mb-4">
            🎬 Digital News
          </h2>

          {/* Category */}
          <label className="block mb-2 font-semibold text-gray-700">
            Category
          </label>
          {renderCategories(digitalCategory, setDigitalCategory)}

          {/* Title */}
          <input
            type="text"
            value={digitalTitle}
            onChange={(e) => setDigitalTitle(e.target.value)}
            placeholder="Enter digital news title"
            className="w-full rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 p-4 mb-6"
          />

          {/* My City Fields */}
          {digitalCategory === "My City" && (
            <>
              <input
                type="text"
                value={digitalState}
                onChange={(e) => setDigitalState(e.target.value)}
                placeholder="Enter state"
                className="w-full rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 p-4 mb-6"
              />
              <input
                type="text"
                value={digitalCity}
                onChange={(e) => setDigitalCity(e.target.value)}
                placeholder="Enter city"
                className="w-full rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 p-4 mb-6"
              />
            </>
          )}

          {/* Anchor */}
          <input
            type="text"
            value={digitalAnchor}
            onChange={(e) => setDigitalAnchor(e.target.value)}
            placeholder="Enter anchor name"
            className="w-full rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 p-4 mb-6"
          />

          {/* Script → TTS */}
          <textarea
            rows="4"
            value={digitalShortDesc}
            onChange={(e) => setDigitalShortDesc(e.target.value)}
            placeholder="Enter full news script (Audio will be generated automatically via Google TTS)"
            className="w-full rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 p-4 mb-6"
          />

          {/* Upload Video */}
          <div className="mb-6">
            <label className="block mb-2 font-semibold text-gray-700">
              Upload Video (MP4)
            </label>
            <div
              onClick={() => videoInputRef.current.click()}
              className="min-h-45 border-2 border-dashed border-emerald-300 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-emerald-50 transition"
            >
              <input
                ref={videoInputRef}
                type="file"
                accept="video/mp4"
                hidden
                onChange={(e) => handleDigitalVideo(e.target.files[0])}
              />
              <div className="text-emerald-600 text-4xl mb-2">🎬</div>
              {digitalVideo ? (
                <div>
                  <p className="text-sm text-gray-700 font-medium">
                    {digitalVideo.name}
                  </p>
                  {/* ✅ Show video size for user awareness */}
                  <p className="text-xs text-gray-400 mt-1">
                    {(digitalVideo.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <>
                  <p className="font-semibold text-emerald-600">
                    Click to upload video
                  </p>
                  <p className="text-xs text-gray-500 mt-1">MP4 only</p>
                </>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              onClick={handlePublishDigital}
              disabled={isSubmitting}
              className={`px-8 py-3 text-white rounded-xl font-semibold transition shadow-md cursor-pointer ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isSubmitting ? "⏳ Submitting..." : "🚀 Publish Digital News"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default News;
