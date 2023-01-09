import { useEffect, useState, useLayoutEffect, useRef } from 'react';
import axios from 'axios';
import ReactAudioPlayer from 'react-audio-player';

import Web3 from 'web3';
import Radio from '../smart-contracts/build/contracts/Radio.json';
import NFT from '../smart-contracts/build/contracts/NFT.json';
import Image from 'next/image';

const RadioPage = () => {
  const [nfts, setNfts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [heatCount, setHeatCount] = useState(0);

  const audioRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    loadSongs();
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [currentIndex]);

  async function loadSongs() {
    const web3 = new Web3(window.ethereum);

    const networkId = await web3.eth.net.getId();

    // Get all listed NFTs
    const radioContract = new web3.eth.Contract(
      Radio.abi,
      Radio.networks[networkId].address
    );
    const listings = await radioContract.methods.getListedNfts().call();
    // Iterate over the listed NFTs and retrieve their metadata
    const nfts = await Promise.all(
      listings.map(async (i) => {
        try {
          const NFTContract = new web3.eth.Contract(
            NFT.abi,
            NFT.networks[networkId].address
          );
          const tokenURI = await NFTContract.methods.tokenURI(i.tokenId).call();
          const meta = await axios.get(tokenURI);
          const nft = {
            tokenId: i.tokenId,
            seller: i.seller,
            owner: i.buyer,
            image: meta.data.image,
            name: meta.data.name,
            coverImage: meta.data.coverImage,
            heatCount: i.heatCount,
          };
          return nft;
        } catch (err) {
          console.log(err);
          return null;
        }
      })
    );
    setNfts(nfts.filter((nft) => nft !== null));
  }

  async function handleGiveHeat() {
    // Get an instance of the Radio contract
    const web3 = new Web3(window.ethereum);
    const networkId = await web3.eth.net.getId();
    const radioContract = new web3.eth.Contract(
      Radio.abi,
      Radio.networks[networkId].address
    );

    // Call the giveHeat function of the Radio contract
    radioContract.methods
      .giveHeat(nfts[currentIndex].tokenId, heatCount)
      .send({ from: window.ethereum.selectedAddress, value: heatCount });
  }

  function handlePrevious() {
    setCurrentIndex(currentIndex - 1);
  }

  function handleNext() {
    setCurrentIndex(currentIndex + 1);
  }

  function handlePlayPause() {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.pause();
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }

  return (
    <div>
      <div className="hero mt-12">
        {nfts.length > 0 ? (
          <div key={currentIndex} className="card border border-[#2a2a2a]">
            <figure>
              <Image
                src={nfts[currentIndex].coverImage}
                width={500}
                height={500}
                alt="cover"
                className="border-b border-[#2a2a2a]"
              />
            </figure>
            <div className="card-body">
              <h1 className="">
                Heat Count: {nfts[currentIndex].heatCount} 🔥
              </h1>
              <h2 className="card-title text-center justify-center">
                {nfts.length > 0 && nfts[currentIndex].name}
              </h2>
              <p className="text-center">
                {nfts.length > 0 && nfts[currentIndex].seller.slice(0, 6)}...
                {nfts.length > 0 && nfts[currentIndex].seller.slice(38, 42)}
              </p>

              <div className="flex justify-between space-x-4 mt-4">
                <button
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  className="btn btn-outline rounded-3xl  normal-case bg-[#353535] border-[#2a2a2a]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 16.811c0 .864-.933 1.405-1.683.977l-7.108-4.062a1.125 1.125 0 010-1.953l7.108-4.062A1.125 1.125 0 0121 8.688v8.123zM11.25 16.811c0 .864-.933 1.405-1.683.977l-7.108-4.062a1.125 1.125 0 010-1.953L9.567 7.71a1.125 1.125 0 011.683.977v8.123z"
                    />
                  </svg>
                </button>
                <ReactAudioPlayer
                  src={nfts[currentIndex].image}
                  ref={audioRef}
                  onEnded={() => {
                    if (currentIndex < nfts.length - 1) {
                      setCurrentIndex(currentIndex + 1);
                    }
                  }}
                  className="h-12 w-full"
                  controls
                  autoPlay
                />
                <button
                  onClick={handleNext}
                  disabled={currentIndex === nfts.length - 1}
                  className="btn btn-outline rounded-3xl normal-case bg-[#353535] border-[#2a2a2a]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062A1.125 1.125 0 013 16.81V8.688zM12.75 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062a1.125 1.125 0 01-1.683-.977V8.688z"
                    />
                  </svg>
                </button>
              </div>

              <div className="card-actions justify-between mt-4">
                <label
                  htmlFor="my-modal-6"
                  className="btn btn-ghost btn-secondary normal-case rounded-3xl cursor-pointer"
                >
                  Report Beat
                </label>

                <label
                  htmlFor="my-modal-5"
                  className="rounded-3xl relative p-0.5 inline-flex items-center justify-center font-bold overflow-hidden group cursor-pointer"
                >
                  <span className="rounded-3xl w-full h-full bg-gradient-to-br from-yellow-600  to-red-600 group-hover:from-yellow-600  group-hover:to-red-600 absolute"></span>
                  <span className="rounded-3xl relative px-6 py-3 transition-all ease-out bg-black  group-hover:bg-opacity-0 duration-400">
                    <span className="rounded-3xl relative text-white">
                      Heat 🔥
                    </span>
                  </span>
                </label>
              </div>
            </div>
          </div>
        ) : (
          <p>
            No songs found. This can mean the following: No wallet provider
            found. No songs have been uploaded yet. Try again in a couple
            seconds.
          </p>
        )}
      </div>
      <input type="checkbox" id="my-modal-6" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box rounded-t-3xl">
          <h3 className="font-bold text-lg">
            Sorry! This feature is not available yet.
          </h3>
          <p className="py-4">
            I am working on this feature. Please check back later. For now,
            Please message me on Twitter @abdo_eth
          </p>
          <div className="modal-action">
            <label htmlFor="my-modal-6" className="btn rounded-3xl">
              close
            </label>
          </div>
        </div>
      </div>

      <input type="checkbox" id="my-modal-5" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box rounded-t-3xl">
          <h2 className="text-3xl mb-4 text-center">Give Heat 🔥</h2>
          <div className="collapse collapse-arrow rounded-3xl">
            <input type="checkbox" />
            <div className="collapse-title text-xl font-medium bg-[#2a2a2a] h-12">
              What is Heat?
            </div>
            <div className="collapse-content bg-[#1a1a1a]">
              <p className="p-4">
                {' '}
                Heat is a way to show your appreciation for a song. The more
                heat a song has, the more it will be promoted and pushed to the
                top of the queue. <br />
                As of now it is a contract interation, but soon all "Heat"
                values will be sent to the uploader.
              </p>
            </div>
          </div>

          <p className="text-center text-xl mt-4">
            1 Heat = 1 MATIC.
            <br />
            You can give as much heat as you want.
          </p>
          {/* <input
            type="number"
            value={heatCount}
            onChange={(event) => setHeatCount(event.target.value)}
          /> */}
          <div className="form-control">
            <label className="label ">
              <span className="label-text">Enter amount</span>
            </label>
            <label className="input-group ">
              <span>🔥</span>
              <input
                type="number"
                placeholder="10"
                className="input input-bordered "
                id="heatcountinput"
                onChange={(event) => setHeatCount(event.target.value)}
              />
              <span>MATIC</span>
            </label>

            {nfts[currentIndex] && (
              <h1 id="heatcounttext" className="text-center text-xl mt-4">
                You are giving {heatCount} Heat to {nfts[currentIndex].name}
              </h1>
            )}
          </div>
          <button
            className="btn btn-primary rounded-3xl w-full mt-4"
            onClick={handleGiveHeat}
          >
            Give Heat
          </button>
          <div className="modal-action">
            <label htmlFor="my-modal-5" className="btn">
              Yay!
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadioPage;
