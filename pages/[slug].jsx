import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import toast from 'react-hot-toast';
import axios from 'axios';
import { motion } from 'framer-motion';
import ReactAudioPlayer from 'react-audio-player';

import Web3 from 'web3';
import Radio from '../smart-contracts/build/contracts/Radio.json';
import NFT from '../smart-contracts/build/contracts/NFT.json';
import Image from 'next/image';

export default function ProjectShowcase() {
  const router = useRouter();
  const { slug } = router.query;

  const [account, setAccount] = useState('');
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');

  useEffect(() => {
    loadNFTs();
  }, [account]);

  async function loadNFTs() {
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

          console.log(nft);
          return nft;
        } catch (err) {
          console.log(err);
          return null;
        }
      })
    );
    setNfts(nfts.filter((nft) => nft !== null));
    setLoadingState('loaded');
  }

  return (
    <div>
      <h1 className="text-center text-3xl p-4 truncate">Songs by {slug}</h1>
      {nfts.map((nft, index) => {
        if (nft.seller === slug) {
          return (
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
                    <div className="space-y-6">
                      <h2 className="card-title text-2xl">
                        {nft.name} | Heat: {nft.heatCount}🔥
                      </h2>
                      <motion.span
                        className="badge card1 rounded p-4"
                        whileHover={{ scale: 1.2 }}
                        transition={{ duration: 0.3 }}
                      >
                        {nft.genre}
                      </motion.span>
                      <ReactAudioPlayer
                        src={nft.image}
                        controls
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        }
      })}
    </div>
  );
}
