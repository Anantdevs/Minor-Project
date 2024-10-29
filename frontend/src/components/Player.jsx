import React, { useEffect, useRef, useState } from "react";
import { SongData } from "../context/Song";
import { GrChapterNext, GrChapterPrevious } from "react-icons/gr";
import { FaPause, FaPlay, FaExpand, FaCompress, FaHeart, FaDollarSign } from "react-icons/fa"; 
import CommentSection from "./commentSection";
import TippingOptions from "./TippingOptions"; // Import the new TippingOptions component
import { UserData } from "../context/User"; // Import UserData hook

const Player = () => {
  const {
    song,
    fetchSingleSong,
    selectedSong,
    isPlaying,
    setIsPlaying,
    nextMusic,
    prevMusic,
  } = SongData();
  const { user } = UserData(); // Access the user from context

  useEffect(() => {
    const loadSong = async () => {
      try {
        await fetchSingleSong(); // Fetch the song
      } catch (error) {
        console.error("Failed to fetch the song:", error);
      }
    };
  
    loadSong();
  }, [fetchSingleSong]);



  const audioRef = useRef(null);

  const handlePlayPause = () => {
    console.log(song)
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const [volume, setVolume] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isLoved, setIsLoved] = useState(false);
  const [selectedTip, setSelectedTip] = useState(null);

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };

  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  useEffect(() => {
  if (song) {
    // Only reset progress if the song changes
    setProgress((prev) => (prev === 0 ? prev : 0)); // Reset only if not already 0

    // Check if likes array exists and then check if user has liked the song
    if (song.likes) {
      setIsLoved(song.likes.includes(user?._id));
    }
  }
}, [song, user]);


  
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const handleLoadedMetaData = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setProgress(audio.currentTime);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetaData);
    audio.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetaData);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [song]);

  const handleProgressChange = (e) => {
    const newTime = (e.target.value / 100) * duration;
    audioRef.current.currentTime = newTime;
    setProgress(newTime);
  };

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };
  const toggleLove = async () => {
    if (user) {
      try {
        const isLiked = isLoved; // Store the current like status
  
        const response = await fetch(`/api/song/${isLiked ? 'unlike' : 'like'}/${song._id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user._id }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to update like status');
        }
  
        const updatedSong = await response.json();
        setIsLoved(!isLiked); // Toggle local state
      } catch (error) {
        console.error('Error toggling like status:', error);
      }
    }
  };

  

  const toggleTip = (amount) => {
    setSelectedTip(amount);
    initiateRazorpay(amount);
  };

  const initiateRazorpay = (amount) => {
    const options = {
      key: "YOUR_RAZORPAY_KEY", // Replace with your Razorpay key
      amount: amount * 100, // Amount in paise
      currency: "INR",
      name: "Tipping for " + song.title,
      description: "Tip to your favorite author",
      image: song.thumbnail ? song.thumbnail.url : "https://via.placeholder.com/150",
      handler: function (response) {
        alert("Payment successful: " + response.razorpay_payment_id);
      },
      prefill: {
        name: "Your Name",
        email: "your.email@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#F37254",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
    rzp.on("payment.failed", function (response) {
      alert("Payment failed: " + response.error.description);
    });
  };

  return (
    <div>
      {song && (
        <div
          className={`${
            isExpanded ? 'fixed top-0 left-0 w-full h-full bg-black' : 'h-[10%] bg-black'
          } flex flex-col justify-between text-white px-4 transition-all duration-300`}
        >
          {isExpanded ? (
            <div className="flex flex-col items-center justify-center h-full">
              <img
                src={song.thumbnail ? song.thumbnail.url : "https://via.placeholder.com/150"}
                className="w-36 mb-4"
                alt=""
              />
              <div className="text-center mb-4">
                <p className="text-lg font-semibold">{song.title}</p>
                <p className="text-sm">{song.description && song.description.slice(0, 30)}...</p>
              </div>
              <div className="flex flex-col items-center">
                {song && song.audio && (
                  <audio ref={audioRef} src={song.audio.url} autoPlay={isPlaying} />
                )}
                <div className="w-full flex items-center font-thin text-green-400">
                  <input
                    type="range"
                    min={"0"}
                    max={"100"}
                    className="progress-bar w-[120px] md:w-[300px]"
                    value={(progress / duration) * 100}
                    onChange={handleProgressChange}
                  />
                </div>
                <div className="flex justify-center items-center gap-4 mt-3">
                  <span className="cursor-pointer" onClick={prevMusic}>
                    <GrChapterPrevious />
                  </span>
                  <button
                    className="bg-white text-black rounded-full p-2"
                    onClick={handlePlayPause}
                  >
                    {isPlaying ? <FaPause /> : <FaPlay />}
                  </button>
                  <span className="cursor-pointer" onClick={nextMusic}>
                    <GrChapterNext />
                  </span>
                </div>
              </div>

              <TippingOptions onSelect={toggleTip} />

              <div className="flex items-center gap-5 mt-2">
                <input
                  type="range"
                  className="w-16 md:w-32"
                  min={"0"}
                  max={"1"}
                  step={"0.01"}
                  value={volume}
                  onChange={handleVolumeChange}
                />
                <div className="cursor-pointer" onClick={toggleExpand}>
                  <FaCompress />
                </div>
                <div className="cursor-pointer" onClick={toggleLove}>
                  <FaHeart className={`${isLoved ? 'text-red-500' : 'text-white'}`} />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <div className="lg:flex items-center gap-4">
                <img
                  src={song.thumbnail ? song.thumbnail.url : "https://via.placeholder.com/50"}
                  className="w-12"
                  alt=""
                />
                <div className="hidden md:block">
                  <p>{song.title}</p>
                  <p>{song.description && song.description.slice(0, 30)}...</p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-1 m-auto">
                {song && song.audio && (
                  <audio ref={audioRef} src={song.audio.url} autoPlay={isPlaying} />
                )}
                <div className="w-full flex items-center font-thin text-green-400">
                  <input
                    type="range"
                    min={"0"}
                    max={"100"}
                    className="progress-bar w-[120px] md:w-[300px]"
                    value={(progress / duration) * 100}
                    onChange={handleProgressChange}
                  />
                </div>
                <div className="flex justify-center items-center gap-4">
                  <span className="cursor-pointer" onClick={prevMusic}>
                    <GrChapterPrevious />
                  </span>
                  <button
                    className="bg-white text-black rounded-full p-2"
                    onClick={handlePlayPause}
                  >
                    {isPlaying ? <FaPause /> : <FaPlay />}
                  </button>
                  <span className="cursor-pointer" onClick={nextMusic}>
                    <GrChapterNext />
                  </span>
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="range"
                  className="w-16 md:w-32"
                  min={"0"}
                  max={"1"}
                  step={"0.01"}
                  value={volume}
                  onChange={handleVolumeChange}
                />
              </div>
              <div className="ml-10 cursor-pointer" onClick={toggleExpand}>
                <FaExpand />
              </div>
              <div className="ml-4 cursor-pointer" onClick={toggleLove}>
                <FaHeart className={`${isLoved ? 'text-red-500' : 'text-white'}`} />
              </div>
            </div>
          )}

          {isExpanded && (
            <div className="relative mt-4">
              {showComments && <CommentSection songId={song._id} onClose={() => setShowComments(false)} />}
              <button
                onClick={() => setShowComments((prev) => !prev)}
                className="bg-blue-500 text-white rounded p-2 mb-2"
              >
                {showComments ? "Hide Comments" : "Show Comments"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Player;
