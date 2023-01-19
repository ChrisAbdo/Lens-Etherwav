import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import axios from 'axios';
import ReactAudioPlayer from 'react-audio-player';
import toast from 'react-hot-toast';
import Image from 'next/image';

import Web3 from 'web3';
import Radio from '../smart-contracts/build/contracts/Radio.json';
import NFT from '../smart-contracts/build/contracts/NFT.json';

const RadioPage = () => {
  const [nfts, setNfts] = useState([]);
  const [topThreeNfts, setTopThreeNfts] = useState([]);

  useEffect(() => {
    loadProfileSongs();
  }, []);

  async function loadProfileSongs() {
    const web3 = new Web3(window.ethereum);

    const networkId = await web3.eth.net.getId();

    // Get all listed NFTs
    const radioContract = new web3.eth.Contract(
      Radio.abi,
      Radio.networks[networkId].address
    );
    const listings = await radioContract.methods
      .getMyListedNfts()
      .call({ from: window.ethereum.selectedAddress });
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
          console.log(nft);
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

  async function deleteNft(tokenId) {
    const notification = toast.loading(
      'Confirm the transaction to delete your song',
      {
        style: {
          border: '1px solid #fff',
          fontWeight: 'bold',
        },
      }
    );

    try {
      const web3 = new Web3(window.ethereum);

      const networkId = await web3.eth.net.getId();

      // Get all listed NFTs
      const radioContract = new web3.eth.Contract(
        Radio.abi,
        Radio.networks[networkId].address
      );
      const accounts = await web3.eth.getAccounts();

      await radioContract.methods
        .deleteNft(tokenId)
        .send({ from: accounts[0] });
      console.log('NFT deleted successfully');
      toast.success('Song deleted successfully', {
        id: notification,
        style: {
          border: '1px solid #fff',
          fontWeight: 'bold',
        },
      });

      // wait for 2 seconds and reload the page
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      toast.error('Could not delete. Try again in a couple seconds.', {
        id: notification,
        style: {
          border: '1px solid #fff',
          fontWeight: 'bold',
        },
      });
      console.log(err);
    }
  }

  return (
    <div>
      <h1 className="text-4xl font-bold text-center mt-6">
        Your Uploaded Songs
      </h1>
      {nfts.map((nft, index) => (
        <div className="p-6">
          <motion.div
            key={nft.tokenId}
            initial={{ y: -200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="card card3 card-side border border-[#2a2a2a] rounded-3xl shadow-xl">
              <figure>
                <Image
                  src={nft.coverImage}
                  alt={nft.name}
                  width={250}
                  height={250}
                  className="h-full bg-black"
                  priority
                />
              </figure>
              <div className="card-body">
                <div className="space-y-6 space-x-4">
                  <h2 className="card-title text-2xl">{nft.name}</h2>
                  <motion.span
                    className="badge card1 rounded p-4"
                    whileHover={{ scale: 1.2 }}
                    transition={{ duration: 0.3 }}
                  >
                    {nft.genre}
                  </motion.span>
                  <motion.span
                    className="badge card1 rounded p-4  min-w-[90px]"
                    whileHover={{ scale: 1.2 }}
                    transition={{ duration: 0.3 }}
                  >
                    Heat: {nft.heatCount}🔥
                  </motion.span>
                  <ReactAudioPlayer
                    src={nft.image}
                    controls
                    className="w-full"
                  />
                </div>

                <div className="card-actions justify-end mt-4">
                  <label
                    htmlFor={`my-modal-${nft.tokenId}`}
                    className="btn btn-outline rounded-xl normal-case"
                  >
                    DELETE{' '}
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
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </label>
                </div>
              </div>
            </div>
          </motion.div>
          <input
            type="checkbox"
            id={`my-modal-${nft.tokenId}`}
            className="modal-toggle"
          />
          <div className="modal modal-bottom sm:modal-middle">
            <div className="modal-box">
              <h3 className="font-bold text-lg flex">
                Are you sure you want to delete: {nft.name} ?{' '}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="red"
                  className="w-24 h-24 animate-pulse flex"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
              </h3>
              <p className="py-4 flex justify-between">
                <br />
                This is not reversible. If you delete this song, it will be gone
                forever and you will not be able to earn any more heat from it.
              </p>

              <button
                className="btn btn-outline rounded-xl w-full normal-case"
                onClick={() => deleteNft(nft.tokenId)}
              >
                Delete {nft.name}
              </button>

              <div className="modal-action">
                <label
                  htmlFor={`my-modal-${nft.tokenId}`}
                  className="btn rounded-xl"
                >
                  close
                </label>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RadioPage;
