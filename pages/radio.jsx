import { useEffect, useState, useLayoutEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import axios from 'axios';
import ReactAudioPlayer from 'react-audio-player';
import toast from 'react-hot-toast';
import Image from 'next/image';

import Web3 from 'web3';
import Radio from '../smart-contracts/build/contracts/Radio.json';
import NFT from '../smart-contracts/build/contracts/NFT.json';
import Link from 'next/link';

const transition = { duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] };

const RadioPage = () => {
  const [nfts, setNfts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shouldPlay, setShouldPlay] = useState(false);
  const [heatCount, setHeatCount] = useState(0);
  const [topThreeNfts, setTopThreeNfts] = useState([]);
  const [direction, setDirection] = useState('right');
  const [isOpen, setIsOpen] = useState(false);
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
            genre: meta.data.genre,
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
    const topThreeNfts = sortedNfts.slice(0, 3);

    setTopThreeNfts(topThreeNfts);
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

      // Give heat to the current NFT
      radioContract.methods
        .giveHeat(nfts[currentIndex].tokenId, heatCount)
        .send({
          from: window.ethereum.selectedAddress,
          value: web3.utils.toWei(heatCount.toString(), 'ether'),
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

  function handleNext() {
    setDirection('right');
    setCurrentIndex((currentIndex + 1) % nfts.length);
  }

  function handlePrevious() {
    setDirection('left');
    setCurrentIndex(currentIndex === 0 ? nfts.length - 1 : currentIndex - 1);
  }

  return (
    <div>
      <div className="collapse collapse-arrow">
        <input type="checkbox" onClick={() => setIsOpen(!isOpen)} />
        <div className="collapse-title text-xl font-medium text-center bg-[#555555] hover:bg-[#2a2a2a] ">
          Heat Leaderboard 🔥
        </div>
        <motion.div
          className="collapse-content"
          initial={false}
          animate={{ height: isOpen ? 'auto' : 0 }}
          transition={{ duration: 0.3 }}
          exit={{ opacity: 0, height: 0, transition: { duration: 0.3 } }}
          style={{ overflow: 'hidden' }}
        >
          <div className=" flex items-center justify-center text-center">
            <div className="stats shadow w-full border border-[#2a2a2a]">
              {topThreeNfts.map((nft, index) => (
                <div className="stat w-full card2">
                  <div className="stat-figure text-primary text-7xl animate-pulse">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                  </div>
                  <div className="stat-title text-2xl">{nft.name}</div>
                  <div className="stat-value ">{nft.heatCount} Heats🔥</div>
                  <div className="stat-desc">
                    <h1 className="text-xl font-medium text-center">
                      {nft.seller.slice(0, 6)}...{nft.seller.slice(-4)}
                    </h1>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="drawer drawer-mobile">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col ">
          {/* <!-- Page content here --> */}
          <label
            htmlFor="my-drawer-2"
            className="btn btn-outline lg:hidden rounded-xl w-1/3 mt-2 mb-2"
          >
            genre{' '}
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
                d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
              />
            </svg>
          </label>
          <div className="hero">
            {nfts.length > 0 ? (
              <div
                key={currentIndex}
                className="card border-b border-[#2a2a2a] rounded-xl w-full"
              >
                <figure>
                  <motion.div
                    key={nfts[currentIndex].tokenId}
                    initial={direction === 'right' ? { x: -100 } : { x: 100 }}
                    animate={{ x: 0 }}
                    exit={direction === 'right' ? { x: 100 } : { x: -100 }}
                    transition={transition}
                  >
                    <Image
                      src={nfts[currentIndex].coverImage}
                      width={400}
                      height={400}
                      alt="cover"
                      className="border-b border-[#2a2a2a] rounded-none min-w-[400px] min-h-[400px] max-w-[400px] max-h-[400px]"
                      priority
                    />
                  </motion.div>
                </figure>
                <div className="text-orange-500 bg-[#2a2a2a] border-none text-center cursor-default h-6">
                  <span>🔥</span> Heat Count: {nfts[currentIndex].heatCount}{' '}
                  <span>🔥</span>
                </div>
                <div className="card-body">
                  <div className="flex justify-between">
                    <motion.span
                      htmlFor="my-modal-69"
                      className="badge card3 rounded cursor-pointer p-4 min-w-[90px]"
                      whileHover={{ scale: 1.2 }}
                      transition={{ duration: 0.3 }}
                    >
                      {nfts[currentIndex].genre}
                    </motion.span>
                    <motion.label
                      htmlFor="my-modal-69"
                      className="badge card3 rounded cursor-pointer p-4"
                      whileHover={{ scale: 1.2 }}
                      transition={{ duration: 0.3 }}
                    >
                      More Info &nbsp;
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
                          d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                        />
                      </svg>
                    </motion.label>
                  </div>
                  <h2 className="card-title text-center justify-center text-2xl">
                    {nfts.length > 0 && nfts[currentIndex].name}
                  </h2>
                  <Link
                    href="/[slug]"
                    as={`/${nfts[currentIndex].seller}`}
                    className="text-center link link-hover"
                  >
                    {nfts.length > 0 && nfts[currentIndex].seller.slice(0, 6)}
                    ...
                    {nfts.length > 0 && nfts[currentIndex].seller.slice(38, 42)}
                  </Link>

                  <div className="flex justify-between space-x-4 mt-4">
                    <button
                      onClick={handlePrevious}
                      disabled={currentIndex === 0}
                      className="btn btn-outline rounded-xl normal-case bg-[#353535] border-[#2a2a2a]"
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
                      className="btn btn-outline rounded-xl normal-case bg-[#353535] border-[#2a2a2a]"
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
                      className="btn btn-outline text-[#555555] normal-case rounded-xl cursor-pointer"
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
                      className="rounded-xl relative p-0.5 inline-flex items-center justify-center font-bold overflow-hidden group cursor-pointer"
                    >
                      <span className="rounded-xl w-full h-full bg-gradient-to-br from-yellow-600  to-red-600 group-hover:from-yellow-600  group-hover:to-red-600 absolute"></span>
                      <span className="rounded-xl relative px-6 py-3 transition-all ease-out bg-black  group-hover:bg-opacity-0 duration-400">
                        <span className="rounded-xl relative text-white">
                          Give Heat 🔥
                        </span>
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-4xl">
                  No songs found. This can mean the following:
                </p>
                <p className="text-2xl mt-4">
                  1. There are no songs on Radio3 yet.
                </p>
                <p className="text-2xl mt-4">
                  2. You are not connected to the correct network (Polygon).
                </p>
                <p className="text-2xl mt-4">
                  3. Your wallet is not connected.
                </p>
                <p className="text-2xl mt-4 bg-[#2a2a2a]">
                  Please try again in a couple seconds. If the issue persists,
                  please message me on Twitter @abdo_eth
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
          <ul className="menu p-4 w-80 bg-[#2a2a2a] text-base-content">
            {/* <!-- Sidebar content here --> */}
            <label className="text-white font-bold text-xl">Genres</label>
            <li>
              <a>Lofi</a>
            </li>
            <li>
              <a>Hiphop</a>
            </li>
            <li>
              <a>Vocals</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Report Modal */}
      <input type="checkbox" id="my-modal-6" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">
            Sorry! This feature is not available yet.
          </h3>
          <p className="py-4">
            I am working on this feature. Please check back later. For now,
            Please message me on Twitter @abdo_eth
          </p>
          <div className="modal-action">
            <label htmlFor="my-modal-6" className="btn rounded-xl">
              close
            </label>
          </div>
        </div>
      </div>

      {/* Give Heat Modal */}
      <input type="checkbox" id="my-modal-5" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h2 className="text-xl mb-4 text-center">Heat 🔥</h2>
          <div className="collapse collapse-arrow rounded-xl">
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
            Please refresh the page after giving heat to see the updated amount.
          </p>

          <div className="flex justify-center text-center ">
            <div className="form-control mt-4  rounded-xl">
              <label className="input-group ">
                <span>🔥</span>
                <input
                  type="number"
                  min={0}
                  placeholder="Enter Heat Count"
                  className="input input-bordered w-full"
                  id="heatcountinput"
                  onChange={(event) => setHeatCount(event.target.value)}
                />
                <span>MATIC</span>
              </label>

              {nfts[currentIndex] && (
                <div
                  id="heatcountdiv"
                  className="bg-[#1f1f1f] border border-[#2a2a2a] mt-4 p-4 max-w-xl rounded-xl"
                >
                  <h1 id="heatcounttext" className="text-center text-xl ">
                    You are giving {heatCount} Heat 🔥 to{' '}
                    {nfts[currentIndex].name}
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
            className="btn btn-outline w-full mt-12 normal-case rounded-xl"
            onClick={handleGiveHeat}
            disabled={heatCount === 0}
          >
            Give Heat!
          </button>
          <div className="modal-action">
            <label htmlFor="my-modal-5" className="btn rounded-xl">
              cancel
            </label>
          </div>
        </div>
      </div>

      <input type="checkbox" id="my-modal-69" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">More Information</h3>
          <p className="py-4">
            {nfts[currentIndex] && nfts[currentIndex].name} | Heat 🔥:{' '}
            {nfts[currentIndex] && nfts[currentIndex].heatCount}
          </p>
          <a
            className="link link-hover text-xs "
            rel="noreferrer"
            target="_blank"
            // href to etherscan with the seller address
            href={`https://etherscan.io/address/${
              nfts[currentIndex] && nfts[currentIndex].seller
            }`}
          >
            Original Author: {nfts[currentIndex] && nfts[currentIndex].seller}
          </a>
          <br />
          <a
            className="link link-hover text-xs "
            rel="noreferrer"
            target="_blank"
            href={
              nfts[currentIndex] && nfts[currentIndex].coverImage.toString()
            }
          >
            Cover Image:{' '}
            {nfts[currentIndex] && nfts[currentIndex].coverImage.toString()}
          </a>
          <br />
          <a
            className="link link-hover text-xs "
            rel="noreferrer"
            target="_blank"
            href={nfts[currentIndex] && nfts[currentIndex].image.toString()}
          >
            Audio Source:{' '}
            {nfts[currentIndex] && nfts[currentIndex].image.toString()}
          </a>
          <br />
          <div className="modal-action">
            <label htmlFor="my-modal-69" className="btn rounded-xl">
              close
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadioPage;
