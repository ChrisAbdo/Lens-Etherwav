import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import Web3 from 'web3';
import Radio from '../smart-contracts/build/contracts/Radio.json';
import NFT from '../smart-contracts/build/contracts/NFT.json';
import toast from 'react-hot-toast';

const upload = () => {
  const [account, setAccount] = useState('');
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(true);
  const [fileUrl, setFileUrl] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [formInput, updateFormInput] = useState({
    name: '',
    coverImage: '',
  });
  const router = useRouter();

  useEffect(() => {
    loadBlockchainData();

    if (formInput.name && formInput.coverImage && fileUrl) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [account, formInput, fileUrl]);

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

  const loadBlockchainData = async () => {
    try {
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
    } catch (err) {
      console.log(err);
    }
  };

  async function onChange(e) {
    // upload image to IPFS
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.io/ipfs/${added.path}`;
      console.log(url);
      setFileUrl(url);
      toast.success('The file has been successfully uploaded to IPFS', {
        style: {
          border: '1px solid #fff',
          backgroundColor: '#2a2a2a',
          fontWeight: 'bold',
          color: '#fff',
        },
      });
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
  }

  async function createCoverImage(e) {
    // upload image to IPFS
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
    } catch (error) {
      console.log('Error uploading file: ', error);
    }
  }

  const removeCoverImage = () => {
    setCoverImage(null);
    updateFormInput({
      ...formInput,
      coverImage: '',
    }); // update form input with empty cover image URL
  };

  async function uploadToIPFS() {
    const { name, coverImage } = formInput;
    if (!name || !coverImage || !fileUrl) {
      return;
    } else {
      // first, upload metadata to IPFS
      const data = JSON.stringify({
        name,
        coverImage,
        image: fileUrl,
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

      setLoading(true);
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

              toast.success('NFT listed', {
                id: notification,
                style: {
                  border: '1px solid #fff',
                  backgroundColor: '#2a2a2a',
                  fontWeight: 'bold',
                  color: '#fff',
                },
              });

              setLoading(false);
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

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-12">
      <div className="card w-96 shadow-xl border border-[#2a2a2a]">
        <figure className="px-10 pt-5">
          <h1 className="text-3xl font-bold text-center">Upload a Beat</h1>
        </figure>
        <div className="card-body items-center text-center">
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Pick a beat</span>
              <span className="label-text-alt">CURRENTLY MP3 ONLY</span>
            </label>
            <input
              type="file"
              className="file-input file-input-bordered w-full max-w-xs"
              accept=".mp3"
              onChange={onChange}
            />
          </div>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Enter a title for your beat</span>
            </label>
            <input
              type="text"
              placeholder="Title here"
              className="input input-bordered w-full max-w-xs"
              onChange={(e) =>
                updateFormInput({ ...formInput, name: e.target.value })
              }
            />
          </div>

          {coverImage ? (
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Choose a cover image</span>
                <span className="label-text-alt">
                  Square images recommended
                </span>
              </label>
              <label className="input-group w-full">
                <input
                  type="text"
                  placeholder="."
                  className="input input-bordered w-full"
                  value={coverImage}
                  disabled
                />
                <span onClick={removeCoverImage} className="btn">
                  X
                </span>
              </label>
            </div>
          ) : (
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">Choose a cover image</span>
                <span className="label-text-alt">
                  Square images recommended
                </span>
              </label>
              <input
                onChange={createCoverImage}
                type="file"
                className="file-input file-input-bordered w-full max-w-xs"
              />
            </div>
          )}

          <div className="card-actions w-full mt-4">
            <button
              disabled={disabled}
              onClick={listNFTForSale}
              className="btn btn-outline w-full"
            >
              Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default upload;
