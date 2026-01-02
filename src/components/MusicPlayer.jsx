import React, { useState, useRef, useEffect } from 'react'
import { Music, Play, Pause, Volume2, VolumeX } from 'lucide-react'
import './MusicPlayer.css'

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const audioRef = useRef(null)

  // 使用公共古筝音乐URL（示例）
  // 实际使用时，您需要添加自己的音乐文件
  const musicUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  return (
    <div className="music-player">
      <audio ref={audioRef} loop>
        <source src={musicUrl} type="audio/mpeg" />
      </audio>
      
      <div className="music-controls">
        <div className="music-icon">
          <Music size={20} />
        </div>
        
        <button onClick={togglePlay} className="control-btn">
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>

        <button onClick={toggleMute} className="control-btn">
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="volume-slider"
        />
      </div>
    </div>
  )
}

export default MusicPlayer

