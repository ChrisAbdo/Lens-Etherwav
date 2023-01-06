import Link from 'next/link';
import { useEffect, useState, memo, useRef } from 'react';
import axios from 'axios';

import Web3 from 'web3';
import Radio from '../smart-contracts/build/contracts/Radio.json';
import NFT from '../smart-contracts/build/contracts/NFT.json';

import { motion } from 'framer-motion';

const RadioPage = memo(() => {
  const [nfts, setNfts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

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
              <img
                src={nfts.length > 0 && nfts[currentIndex].coverImage}
                className="border-b border-[#2a2a2a]"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title text-center justify-center">
                {nfts.length > 0 && nfts[currentIndex].name}
              </h2>
              <p className="text-center">
                {nfts.length > 0 && nfts[currentIndex].seller.slice(0, 6)}...
                {nfts.length > 0 && nfts[currentIndex].seller.slice(38, 42)}
              </p>
              <div className="card-actions justify-between mt-4">
                {/* Previous */}
                <button
                  className="btn btn-secondary"
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
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

                <audio
                  src={nfts[currentIndex].image}
                  ref={audioRef}
                  onEnded={() => {
                    if (currentIndex < nfts.length - 1) {
                      setCurrentIndex(currentIndex + 1);
                    }
                  }}
                />

                {/* Play / Pause */}
                <button className="btn btn-primary" onClick={handlePlayPause}>
                  {isPlaying ? (
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
                        d="M15.75 5.25v13.5m-7.5-13.5v13.5"
                      />
                    </svg>
                  ) : (
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
                        d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
                      />
                    </svg>
                  )}
                </button>

                {/* Next */}
                <button
                  className="btn btn-secondary"
                  onClick={handleNext}
                  disabled={currentIndex === nfts.length - 1}
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
            </div>
          </div>
        ) : (
          <p>No songs found. Please check again in a few seconds.</p>
        )}
      </div>
    </div>
  );
});

export default RadioPage;

// {/* <div
// key={currentIndex}
// className="border-[2px] border-black shadow overflow-hidden hover:scale-[1.03] transform transition duration-500 ease-in-out mb-4"
// >
// <figure className="flex items-center justify-center  w-full">
//   <audio
//     controls
//     controlsList="nodownload"
//     className="w-full border-b-[2px] border-black"
//   >
//     <source src={nfts[currentIndex].image} type="audio/mpeg" />
//   </audio>
// </figure>

// <div className="p-4 space-y-2">
//   <p className="text-2xl font-semibold">
//     {nfts[currentIndex].name}
//   </p>

//   <p className="">
//     <span className="font-semibold">Description: </span>
//     {nfts[currentIndex].description}
//   </p>
//   <p>
//     {/* Uploaded by: {nft.seller.slice(0, 5)}...
//           {nft.seller.slice(-4)} */}
//     <span className="font-semibold">Uploaded by: </span>
//     {nfts[currentIndex].seller.slice(0, 5)}...
//     {nfts[currentIndex].seller.slice(-4)}
//   </p>
//   <p className="space-x-2">
//     <span className="badge">genre</span>
//     <span className="badge">instrument</span>
//   </p>
// </div>
// </div> */}
