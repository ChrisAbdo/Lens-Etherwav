import { useEffect, useState, useLayoutEffect, useRef } from 'react';
import axios from 'axios';
import ReactAudioPlayer from 'react-audio-player';
import toast from 'react-hot-toast';
import Image from 'next/image';

import Web3 from 'web3';
import Radio from '../smart-contracts/build/contracts/Radio.json';
import NFT from '../smart-contracts/build/contracts/NFT.json';

const RadioPage = () => {
  const [nfts, setNfts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shouldPlay, setShouldPlay] = useState(false);

  const [heatCount, setHeatCount] = useState(0);

  const audioRef = useRef(null);

  useEffect(() => {
    loadSongs();
  }, []);

  useEffect(() => {
    setShouldPlay(true);
  }, [currentIndex]);

  useLayoutEffect(() => {
    if (audioRef.current && shouldPlay) {
      audioRef.current.play();
      setIsPlaying(true);
      setShouldPlay(false);
    }
  }, [shouldPlay]);

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
    // setNfts(nfts.filter((nft) => nft !== null));

    // set nfts in order of heatCount
    const sortedNfts = nfts
      .filter((nft) => nft !== null)
      .sort((a, b) => b.heatCount - a.heatCount);
    setNfts(sortedNfts);
  }

  async function handleGiveHeat() {
    const notification = toast.loading(
      'Confirm the transaction to give heat! 🔥🔥🔥',
      {
        style: {
          border: '1px solid #fff',
          backgroundColor: '#2a2a2a',
          fontWeight: 'bold',
          color: '#fff',
        },
      }
    );
    // Get an instance of the Radio contract
    try {
      const web3 = new Web3(window.ethereum);
      const networkId = await web3.eth.net.getId();
      const radioContract = new web3.eth.Contract(
        Radio.abi,
        Radio.networks[networkId].address
      );

      // Call the giveHeat function of the Radio contract

      radioContract.methods
        .giveHeat(nfts[currentIndex].tokenId, heatCount)
        .send({
          from: window.ethereum.selectedAddress,
          value: heatCount,
        })
        .on('receipt', function () {
          console.log('listed');
          document.getElementById(
            'heatcounttext'
          ).innerHTML = `YOU GAVE ${heatCount} HEAT!`;
          document
            .getElementById('heatcountdiv')
            .classList.add('animate-pulse');
          document.getElementById('heatanimation').classList.remove('hidden');

          toast.success('Heat given successfully! 🔥🔥🔥', {
            style: {
              border: '1px solid #fff',
              backgroundColor: '#2a2a2a',
              fontWeight: 'bold',
              color: '#fff',
            },
            id: notification,
          });
        });
    } catch (err) {
      console.log(err);
      toast.error('Heat could not be given! ❌❌❌', {
        style: {
          border: '1px solid #fff',
          backgroundColor: '#2a2a2a',
          fontWeight: 'bold',
          color: '#fff',
        },
        id: notification,
      });
    }
  }

  function handlePrevious() {
    setCurrentIndex(currentIndex - 1);
  }

  function handleNext() {
    setCurrentIndex(currentIndex + 1);
  }

  return (
    <div>
      <div className="hero mt-6 p-2">
        {nfts.length > 0 ? (
          <div key={currentIndex} className="card border border-[#2a2a2a] ">
            <figure>
              <Image
                src={nfts[currentIndex].coverImage}
                width={500}
                height={500}
                alt="cover"
                className="border-b border-[#2a2a2a]"
                priority
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
                  className="btn btn-outline btn-secondary normal-case rounded-3xl cursor-pointer"
                >
                  Report&nbsp;
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
                      d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5"
                    />
                  </svg>
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
                Heat 🔥 is a way to show your appreciation for a song. The more
                heat a song has, the more it will be promoted and pushed to the
                top of the queue. <br />
                As of now it is a contract interaction, but very soon all Heat
                values will be sent to the uploader. EST Feb 2023.
              </p>
            </div>
          </div>

          <p className="text-center text-xl mt-4">
            1 Heat = 1 MATIC.
            <br />
            You can give as much heat as you want.
            <br />
            Please refresh the page after giving heat to see the updated heat.
          </p>
          {/* <input
            type="number"
            value={heatCount}
            onChange={(event) => setHeatCount(event.target.value)}
          /> */}
          <div className="flex justify-center text-center p-4">
            <div className="form-control mt-4 border border-[#2a2a2a] p-4 rounded-3xl">
              <label className="input-group ">
                <span>🔥</span>
                <input
                  type="number"
                  placeholder="Enter Heat Count"
                  className="input input-bordered "
                  id="heatcountinput"
                  onChange={(event) => setHeatCount(event.target.value)}
                />
                <span>MATIC</span>
              </label>

              {nfts[currentIndex] && (
                <div
                  id="heatcountdiv"
                  className="bg-[#1f1f1f] border border-[#2a2a2a] mt-4 p-4 max-w-xl rounded-3xl"
                >
                  <h1 id="heatcounttext" className="text-center text-xl ">
                    You are giving {heatCount} Heat 🔥
                  </h1>
                  <div
                    id="heatanimation"
                    className="hidden flex text-center justify-center items-center"
                  >
                    <span className="fire-emoji">🔥</span>
                    <span className="fire-emoji">🔥</span>
                    <span className="fire-emoji">🔥</span>
                    <span className="fire-emoji">🔥</span>
                    <span className="fire-emoji">🔥</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <button
            className="btn btn-primary rounded-3xl w-full mt-4"
            onClick={handleGiveHeat}
          >
            Give Heat
          </button>
          <div className="modal-action">
            <label htmlFor="my-modal-5" className="btn">
              X
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadioPage;
