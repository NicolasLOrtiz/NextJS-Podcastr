import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { usePlayer } from '../../contexts/PlayerContext';
import styles from './styles.module.scss';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

export default function Player() {
	const audioRef = useRef<HTMLAudioElement>(null);
	const [progress, setProgress] = useState(0);

	const { 
		episodeList, 
		currentEpisodeIndex, 
		isPlaying, 
		hasNext,
		hasPrevious,
		isLooping,
		isShuffle,
		togglePlay,
		playNext,
		playPrevious,
		setPlayingState,
		toggleLoop,
		toggleShuffle,
		clearPlayerState
	} = usePlayer();

	useEffect(() => {
		if (!audioRef.current){
			return;
		}

		if (isPlaying) {
			audioRef.current.play();
		} else {
			audioRef.current.pause();
		}

	}, [isPlaying]);

	function setupProgressListener() {
		audioRef.current.currentTime = 0;

		audioRef.current.addEventListener('timeupdate', () => {
			setProgress(Math.floor(audioRef.current.currentTime));
		});
	}

	function handleSeek(amount: number){
		audioRef.current.currentTime = amount;
		setProgress(amount);
	}

	function handleEpisodeEnded(){
		if (hasNext) {
			playNext()
		} else {
			clearPlayerState()
		}
	}

	const episode = episodeList[currentEpisodeIndex];

	return (
		<div className={styles.playerContainer}>
			<header>
				<img src="/images/playing.svg" alt="Tocando agora" />
				<strong>Tocando agora</strong>
			</header>

			{ episode ? (
				<div className={styles.currentEpisode}>
					<Image width={592} height={592} src={episode.thumbnail} objectFit="cover"/>
					<strong>{episode.title}</strong>
					<span>{episode.members}</span>
				</div>
			) : (
				<div className={styles.emptyPlayer}>
					<strong>Selecione um podcast para ouvir</strong>
				</div>
			) }
			

			<footer className={!episode ? styles.empty : ''}>
				<div className={styles.progress}>
					<span>{ convertDurationToTimeString(progress) }</span>
					<div className={styles.slider}>
						{ episode ? (
							<Slider 
								max={episode?.duration}
								value={progress}
								onChange={handleSeek}
								trackStyle={{ backgroundColor: '#04d361' }}
								railStyle={{ backgroundColor: '#9f75ff' }}
								handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
							/>
						) : (
							<div className={styles.emptySlider} />
						) }
					</div>
					<span>{ convertDurationToTimeString(episode?.duration ?? 0) }</span>
				</div>

				{ episode && (
					<audio
						src={episode.url}
						ref={audioRef}
						autoPlay
						onPlay= {() => setPlayingState(true)}
						onPause= {() => setPlayingState(false)}
						onEnded={handleEpisodeEnded()}
						loop={isLooping}
						onLoadedMetadata={setupProgressListener}
					/>
				) }

				<div className={styles.buttons}>
					<button 
						type="button" 
						disabled={!episode || episodeList.length === 1} 
						className={isShuffle ? styles.isActive : ''}
						onClick={toggleShuffle}
					>
						<img src="/images/shuffle.svg" alt="Embaralhar" />
					</button>

					<button type="button" disabled={!episode || !hasPrevious} onClick={playPrevious}>
						<img src="/images/play-previous.svg" alt="Tocar anterior" />
					</button>

					<button type="button" className={styles.playButton} disabled={!episode} onClick={togglePlay}>
						{
							isPlaying 
							? <img src="/images/pause.svg" alt="Pausar" />
							: <img src="/images/play.svg" alt="Tocar" />
						}
					</button>

					<button type="button" disabled={!episode || !hasNext} onClick={playNext}>
						<img src="/images/play-next.svg" alt="Tocar próxima" />
					</button>

					<button 
						type="button" 
						disabled={!episode} 
						onClick={toggleLoop}
						className={isLooping ? styles.isActive : ''}
					>
						<img src="/images/repeat.svg" alt="Repetir" />
					</button>
				</div>
			</footer>
		</div>
	);
}
