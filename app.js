const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'NHAN_NGUYEN_PLAYER';

const cd = $('.cd');
const cdThumb = $('.cd-thumb');
const heading = $('header h2');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const audioProgess = $('#progress');
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');

const app = {
	isPlaying: false,

	config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {
		// Default config for any devices
		currentIndex: 0,
		isRandom: false,
		isRepeated: false,
	},

    songs: [
        {
          name: "Ai chung tình được mãi",
          singer: "Trung Quân Idol",
          path: "./assets/musics/ai-chung-tinh-duoc-mai.mp3",
          image: "./assets/img/ai-chung-tinh-duoc-mai.jpg"
        },
        {
          name: "Bao tiền một mớ bình yên",
          singer: "14 Casper",
          path: "./assets/musics/bao-tien-mot-mo-binh-yen.mp3",
          image:
            "./assets/img/bao-tien-mot-mo-binh-yen.jpg"
        },
        {
          name: "Đã sai từ lúc đầu",
          singer: "Trung Quân Idol | Bùi Anh Tuấn",
          path:
            "./assets/musics/da-sai-tu-luc-dau.mp3",
          image: "./assets/img/da-sai-tu-luc-dau.jpg"
        },
        {
          name: "Đi qua mùa hạ",
          singer: "Thái Đinh",
          path: "./assets/musics/di-qua-mua-ha.mp3",
          image:
            "./assets/img/di-qua-mua-ha.jpg"
        },
        {
          name: "Phố không em",
          singer: "Thái Đinh",
          path: "./assets/musics/pho-khong-em.mp3",
          image:
            "./assets/img/pho-khong-em.jpg"
        },
        {
          name: "Rồi ta sẽ ngắm pháo hoa cùng nhau",
          singer: "O.lew",
          path:
            "./assets/musics/roi-ta-se-ngam-phao-hoa-cung-nhau.mp3",
          image:
            "./assets/img/roi-ta-se-ngam-phao-hoa-cung-nhau.jpg"
        },
        {
          name: "Tự tình 2",
          singer: "Trung Quân Idol",
          path: "./assets/musics/tu-tinh-2.mp3",
          image:
          "./assets/img/tu-tinh-2.jpg"
        },
		{
			name: "Anh tự do nhưng cô đơn",
			singer: "Trung Quân Idol",
			path: "./assets/musics/anh-tu-do-nhung-co-don.mp3",
			image:
			"./assets/anh-tu-do-nhung-co-don.jpg"
		},
		{
			name: "Yêu người có ước mơ",
			singer: "Bùi Trường Linh",
			path: "./assets/musics/yeu-nguoi-co-uoc-mo.mp3",
			image:
			"./assets/yeu-nguoi-co-uoc-mo.jpg"
		},
		{
			name: "Dù cho mai về sau",
			singer: "Bùi Trường Linh",
			path: "./assets/musics/du-cho-mai-ve-sau.mp3",
			image:
			"./assets/du-cho-mai-ve-sau.jpg"
		},
		{
			name: "Đường tôi chở em về",
			singer: "Bùi Trường Linh",
			path: "./assets/musics/duong-toi-cho-em-ve.mp3",
			image:
			"./assets/duong-toi-cho-em-ve.jpg"
		},
    ],

	setConfig: function(key, value) {
		this.config[key] = value;
		localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
	},

    render: function() {
		randomBtn.classList.toggle('active', this.isRandom);
		repeatBtn.classList.toggle('active', this.isRepeated);
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}">
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playlist.innerHTML = htmls.join('')
    },

	defineProperties: function() {
		Object.defineProperty(this, 'currentSong', {
			get: function() {
				return this.songs[this.currentIndex];
			}
		})
	},

    handleEvents: function() {
		const __this__ = this;
        const cdWidth = cd.offsetWidth;
		const songs = $$('.song');

		// Handle spinning CD
		const cdThumbAnimate = cdThumb.animate([
			{transform: 'rotate(360deg)'}
		], {
			duration: 10000,
			iterations: Infinity
		});

		cdThumbAnimate.pause();

		// Handle song thumbnail zoom in zoom out
        document.addEventListener('scroll', () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        });

		// Handle click on play button
		playBtn.addEventListener('click', () => {
			__this__.isPlaying ? audio.pause() : audio.play();
		});

		// When song is played
		audio.onplay = () => {
			__this__.isPlaying = true;
			player.classList.add('playing');
			cdThumbAnimate.play();
		};

		// When song is paused
		audio.onpause = () => {
			__this__.isPlaying = false;
			player.classList.remove('playing');
			cdThumbAnimate.pause();
		}

		// Handle progress bar
		audio.ontimeupdate = () => {
			if (audio.duration) {
				const progress = Math.floor(audio.currentTime / audio.duration * 100)
				audioProgess.value = progress;
			}
		}

		// Handle fast forward
		audioProgess.onchange = (e) => {
			const seekTime = e.target.value / 100 * audio.duration;
			audio.currentTime = seekTime;
		}

		// Handle next song
		nextBtn.addEventListener('click', () => {
			songs[__this__.currentIndex].classList.toggle('active');
			__this__.isRandom ? __this__.randomSong() : __this__.nextSong();
			__this__.setConfig('currentIndex', __this__.currentIndex)
			audio.play();
			songs[__this__.currentIndex].classList.toggle('active');
			__this__.scrollToActiveSong();
		})

		// Handle prev song
		prevBtn.addEventListener('click', () => {
			songs[__this__.currentIndex].classList.toggle('active');
			__this__.prevSong();
			__this__.setConfig('currentIndex', __this__.currentIndex)
			audio.play();
			songs[__this__.currentIndex].classList.toggle('active');
			__this__.scrollToActiveSong();
		})

		// Handle random songs choose
		randomBtn.addEventListener('click', () => {
			__this__.isRandom = !__this__.isRandom;
			__this__.setConfig('isRandom', __this__.isRandom);
			randomBtn.classList.toggle('active', __this__.isRandom);
		})

		// Handle song loop
		repeatBtn.addEventListener('click', () => {
			__this__.isRepeated = !__this__.isRepeated;
			__this__.setConfig('isRepeated', __this__.isRepeated);
			repeatBtn.classList.toggle('active', __this__.isRepeated);
		})

		// Handle end of audio
		audio.onended = () => {
			this.isRepeated ? audio.play() : nextBtn.click();
		}

		// Handle click on playlist
		songs.forEach((song, index) => {
			song.addEventListener('click', function() {
				if (!song.classList.contains('active')) {
					songs[__this__.currentIndex].classList.remove('active');
					song.classList.add('active');
					__this__.currentIndex = index;
					__this__.setConfig('currentIndex', __this__.currentIndex);
					__this__.loadCurrentSong();
					audio.play();
				}
			})
		})
    },
	
	scrollToActiveSong: function() {
		setTimeout(() => {
			$('.song.active').scrollIntoView({
				behavior: 'smooth',
				block: 'nearest'
			});
		}, 300);
	},

	loadCurrentSong: function() {
		heading.textContent = this.currentSong.name;
		cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
		audio.src = this.currentSong.path;
	},

	loadConfig: function() {
		this.isRandom = this.config.isRandom;
		this.isRepeated = this.config.isRepeated;
		this.currentIndex = this.config.currentIndex;
	},

	nextSong: function() {
		this.currentIndex++;
		if (this.currentIndex > this.songs.length - 1) {
			this.currentIndex = 0;
		}
		this.loadCurrentSong();
	},

	prevSong: function() {
		this.currentIndex--;
		if (this.currentIndex < 0) {
			this.currentIndex = this.songs.length - 1;
		}
		this.loadCurrentSong();
	},

	randomSong: function() {
		let randIndex;
		do {
			randIndex = Math.floor(Math.random() * this.songs.length)
		} while (this.currentIndex === randIndex);

		this.currentIndex = randIndex;
		this.loadCurrentSong();
	},
	
    start: function() {
		// Load config of users from storage
		this.loadConfig();

		// Render playlist
        this.render();

		// Define Properties for objects
		this.defineProperties();

		// Listen / Handle DOM events
        this.handleEvents();

		// Load first song into UI when running app
		this.loadCurrentSong();
    }
};

app.start();