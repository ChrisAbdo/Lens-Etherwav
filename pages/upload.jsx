import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';

import Web3 from 'web3';
import Radio from '../smart-contracts/build/contracts/Radio.json';
import NFT from '../smart-contracts/build/contracts/NFT.json';
import toast from 'react-hot-toast';

const ipfsClient = require('ipfs-http-client');
const projectId = '2FdliMGfWHQCzVYTtFlGQsknZvb';
const projectSecret = '2274a79139ff6fdb2f016d12f713dca1';
const auth =
  'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
const client = ipfsClient.create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});

const upload = () => {
  const [formInput, updateFormInput] = useState({
    name: '',
    coverImage: '',
    genre: '',
  });
  const [account, setAccount] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [fileUrl, setFileUrl] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [currentInputIndex, setCurrentInputIndex] = useState(0);
  const [direction, setDirection] = useState('right');

  const inputs = [
    <div className="form-control w-full max-w-xs">
      <label className="label">
        <span className="label-text">Pick a beat</span>
        <span className="label-text-alt">CURRENTLY MP3 ONLY</span>
      </label>
      <input
        type="file"
        className="file-input file-input-bordered w-full max-w-xs rounded-xl"
        accept=".mp3"
        onChange={onChange}
      />
    </div>,
    <div className="form-control w-full max-w-xs">
      <label className="label">
        <span className="label-text">Enter a title for your beat</span>
      </label>
      <input
        type="text"
        placeholder="Title here"
        className="input input-bordered w-full max-w-xs rounded-xl"
        onChange={(e) =>
          updateFormInput({ ...formInput, name: e.target.value })
        }
      />
    </div>,
    <div className="form-control w-full max-w-xs">
      <label className="label">
        <span className="label-text">cover image</span>
        <span className="label-text-alt">400x400</span>
      </label>
      <input
        onChange={createCoverImage}
        type="file"
        accept="image/*"
        className="file-input file-input-bordered w-full max-w-xs rounded-xl"
      />
    </div>,

    <div>
      <label className="label">
        <span className="label-text">Select a genre</span>
      </label>
      <select
        onChange={(e) =>
          updateFormInput({ ...formInput, genre: e.target.value })
        }
        className="select select-bordered w-full max-w-xs rounded-xl"
      >
        <option disabled selected>
          Select Genre
        </option>
        <option value="lofi">Lofi</option>
        <option value="hiphop">Hip Hop</option>
        <option value="vocals">Vocals</option>
      </select>
    </div>,
  ];

  const router = useRouter();

  useEffect(() => {
    if (formInput.name && formInput.coverImage && formInput.genre && fileUrl) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [account, formInput, fileUrl]);

  async function onChange(e) {
    // upload image to IPFS
    setLoading(true);
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.io/ipfs/${added.path}`;
      console.log(url);
      setLoading(false);
      setFileUrl(url);
      toast.success('received audio file');
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
  }

  async function createCoverImage(e) {
    // upload image to IPFS
    setImageLoading(true);
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.io/ipfs/${added.path}`;
      console.log(url);
      setCoverImage(url);
      updateFormInput({
        ...formInput,
        coverImage: url,
      }); // update form input with cover image URL
      setImageLoading(false);
      toast.success('received cover image');
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
  }

  async function uploadToIPFS() {
    const { name, coverImage, genre } = formInput;
    if (!name || !coverImage || !genre || !fileUrl) {
      return;
    } else {
      // first, upload metadata to IPFS
      const data = JSON.stringify({
        name,
        coverImage,
        image: fileUrl,
        genre,
      });
      try {
        const added = await client.add(data);
        const url = `https://ipfs.io/ipfs/${added.path}`;
        // after metadata is uploaded to IPFS, return the URL to use it in the transaction

        return url;
      } catch (error) {
        console.log('Error uploading file: ', error);
      }
    }
  }

  async function listNFTForSale() {
    const notification = toast.loading(
      'Make sure to confirm both transactions!',
      {
        style: {
          border: '1px solid #fff',
          backgroundColor: '#2a2a2a',
          fontWeight: 'bold',
          color: '#fff',
        },
      }
    );

    try {
      const web3 = new Web3(window.ethereum);
      const provider = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      const url = await uploadToIPFS();
      const networkId = await web3.eth.net.getId();

      // Mint the NFT
      const NFTContractAddress = NFT.networks[networkId].address;
      const NFTContract = new web3.eth.Contract(NFT.abi, NFTContractAddress);
      const accounts = await web3.eth.getAccounts();
      const radioContract = new web3.eth.Contract(
        Radio.abi,
        Radio.networks[networkId].address
      );

      NFTContract.methods
        .mint(url)
        .send({ from: accounts[0] })
        .on('receipt', function (receipt) {
          console.log('minted');
          // List the NFT
          const tokenId = receipt.events.NFTMinted.returnValues[0];
          radioContract.methods
            .listNft(NFTContractAddress, tokenId)
            .send({ from: accounts[0] })
            .on('receipt', function () {
              console.log('listed');

              toast.success('Listed to Radio3!', {
                id: notification,
                style: {
                  border: '1px solid #fff',
                  backgroundColor: '#2a2a2a',
                  fontWeight: 'bold',
                  color: '#fff',
                },
              });

              // wait 2 seconds, then reload the page
              setTimeout(() => {
                router.push('/radio');
              }, 2000);
            });
        });
    } catch (error) {
      console.log(error);
      toast.error('Error creating stem', {
        id: notification,
        style: {
          border: '1px solid #fff',
          backgroundColor: '#2a2a2a',
          fontWeight: 'bold',
          color: '#fff',
        },
      });
    }
  }

  const handleClick = (next) => {
    if (next) {
      setDirection('left');
    } else {
      setDirection('right');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full px-12 py-4">
      {/* CARD */}
      <div className="card w-96 shadow-xl border border-[#2a2a2a] rounded-3xl uploadcard ">
        <figure className="px-10 pt-5">
          <h1 className="text-3xl font-bold text-center">Upload a Beat</h1>
        </figure>
        <p className="mt-2 text-sm text-center text-gray-400">
          PLEASE NOTE: THE BUTTON WILL BE DISABLED UNTIL ALL ASSETS ARE UPLOADED
          TO IPFS, THIS CAN TAKE A COUPLE SECONDS
        </p>
        <div className="card-body ">
          <AnimatePresence>
            <div
              className="input-container"
              style={{
                display: 'inline-flex',
                width: '100%',
                overflowX: 'hidden',
              }}
            >
              {inputs[currentInputIndex] && (
                <motion.div
                  key={currentInputIndex}
                  initial={{ x: direction === 'right' ? '-100%' : '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: direction === 'right' ? '-100%' : '100%' }}
                  transition={{ type: 'tween', duration: 0.5 }}
                >
                  {inputs[currentInputIndex]}
                </motion.div>
              )}
            </div>
          </AnimatePresence>

          <div className="flex justify-between mt-4">
            <button
              className="btn rounded-xl"
              onClick={() => {
                setCurrentInputIndex(currentInputIndex - 1);
                handleClick(false);
              }}
              disabled={currentInputIndex === 0}
            >
              Previous
            </button>

            <div className="btn-group rounded-xl">
              <button className="btn rounded-xl" disabled>
                {currentInputIndex + 1} of {inputs.length}
              </button>
            </div>
            <button
              className="btn rounded-xl"
              onClick={() => {
                setCurrentInputIndex(currentInputIndex + 1);
                handleClick(true);
              }}
              disabled={currentInputIndex === inputs.length - 1}
            >
              Next
            </button>
          </div>
          <div className="card-actions w-full mt-4">
            {disabled ? (
              <button
                disabled={disabled}
                onClick={listNFTForSale}
                className="btn btn-outline w-full rounded-xl"
              >
                Upload
              </button>
            ) : (
              <button
                disabled={disabled}
                onClick={listNFTForSale}
                className="btn btn-outline w-full rounded-xl"
              >
                Upload{' '}
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
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="divider">OR</div>

      <div className="card w-96 shadow-xl border border-[#2a2a2a] rounded-3xl uploadcard">
        <figure className="px-10 pt-5">
          <h1 className="text-3xl font-bold text-center">
            Not sure what to upload?
          </h1>
        </figure>
        <div className="card-body items-center text-center">
          <h1 className="text-xl font-bold text-center">
            Browse the radio for some inspiration!
          </h1>
          <div className="card-actions w-full mt-4">
            <a href="/radio" className="btn btn-outline w-full rounded-xl">
              Listen to radio
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default upload;
