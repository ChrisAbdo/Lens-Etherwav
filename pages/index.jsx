import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Marquee from 'react-fast-marquee';

const Home = () => {
  const router = useRouter();
  return (
    <div className="bg-grid-[#0f0f0f]">
      <Marquee
        pauseOnHover={true}
        gradient={false}
        speed={100}
        className="bg-[#2a2a2a] py-4"
      >
        <h1 className="text-2xl font-bold gradient-shadow">
          Tune in to the future with Etherwav - Algorithmically rewarding,
          community driven.&nbsp;
        </h1>{' '}
      </Marquee>
      <div className="hero p-6">
        <div className="hero-content flex-col lg:flex-row-reverse ">
          <motion.img
            className="w-64 h-64 lg:w-96 lg:h-96"
            id="hero"
            initial={{ hidden: true }}
            animate={{ rotateY: 360, x: 0 }}
            transition={{ duration: 2, ease: 'circInOut' }}
            whileHover={{ rotateY: [0, 360], transition: { duration: 10 } }}
            src="/hero1.png"
            alt="hero"
          />

          <div>
            <h1 className="flex flex-col gap-2 text-center text-6xl font-black md:flex-row lg:tracking-tight xl:text-9xl">
              <span
                className="before:absolute before:-z-10 before:text-white before:content-[attr(data-text)]"
                data-text="Create."
              >
                <span className="animate-gradient-1 bg-gradient-to-r from-yellow-600 to-red-600 bg-clip-text text-transparent">
                  Create.{' '}
                </span>{' '}
              </span>

              <span
                className="before:absolute before:-z-10 before:text-white before:content-[attr(data-text)]"
                data-text="Listen."
              >
                <span className="animate-gradient-2 bg-gradient-to-l from-fuchsia-500 via-red-600 to-orange-400 bg-clip-text text-transparent">
                  {' '}
                  Listen.
                </span>{' '}
              </span>

              <span
                className="before:absolute before:-z-10 before:text-white before:content-[attr(data-text)]"
                data-text="Earn."
              >
                <span className="animate-gradient-3 bg-gradient-to-r from-emerald-500 to-lime-600 bg-clip-text text-transparent">
                  Earn.
                </span>{' '}
              </span>
            </h1>
            <p className="py-6 text-2xl text-[#bebebe]">
              Welcome to <span className="text-2xl font-bold">Etherwav</span>-
              the{' '}
              <span className="font-semibold">
                algorithmically rewarding, community driven
              </span>{' '}
              Web3 radio 🔥
              <br />
              <br />
              Give heat to your favorite songs and push them to the top
            </p>
            <motion.a
              className="btn btn-outline rounded-xl"
              initial={{ x: '-300%' }}
              animate={{ x: 0 }}
              transition={{ delay: 0.4 }}
              href="/radio"
            >
              Get Started
            </motion.a>
            <div className="flex w-1/2">
              <AnimatePresence>
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  whileHover={{ scale: 1.07 }}
                  className="alert bg-black shadow-lg mt-8 rounded-3xl card2 border border-[#2a2a2a]"
                >
                  <div>
                    <span>
                      Powered by{' '}
                      <a
                        href="https://polygon.technology/"
                        rel="noreferrer noopener"
                        target="_blank"
                        className="text-purple-500 link link-hover"
                      >
                        Polygon
                      </a>{' '}
                      &&nbsp;
                      <a
                        href="https://ipfs.tech/"
                        rel="noreferrer noopener"
                        target="_blank"
                        className="text-[#429395] link link-hover"
                      >
                        IPFS
                      </a>
                    </span>
                  </div>

                  <div className="flex-none">
                    <motion.img
                      initial={{ scale: 1 }}
                      animate={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                      whileHover={{ scale: 1.2 }}
                      className="cursor-pointer"
                      src="/polygon.webp"
                      onClick={() => window.open('https://polygon.technology/')}
                      width={50}
                      height={50}
                    />
                    <motion.img
                      initial={{ scale: 1 }}
                      animate={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                      whileHover={{ scale: 1.2 }}
                      className="cursor-pointer"
                      src="/ipfs.png"
                      onClick={() => window.open('https://ipfs.tech/')}
                      width={50}
                      height={25}
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <div className="hero mt-6">
        <div className="bg-black h-64 flex items-center justify-center px-16">
          <div className="relative w-60 max-w-lg z-50">
            <div className="absolute top-0  w-36 h-36 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 w-36 h-36 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 w-36 h-36 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between w-full flex-1 text-center md:flex-row px-8">
          <motion.a
            className="z-40 card  bg-base-100 rounded-3xl border border-[#2a2a2a] hover:bg-[#1a1a1a] card1"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            variants={{
              visible: { opacity: 1, scale: 1 },
              hidden: { opacity: 0, scale: 0 },
            }}
            href="/upload"
          >
            <figure className="px-10 pt-10">
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
                  d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15"
                />
              </svg>
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title">Upload a beat!</h2>
              <p>Are you a producer? This one's for you!</p>
            </div>
          </motion.a>
          <br />
          <motion.a
            className="z-50 card bg-base-100 rounded-3xl border border-[#2a2a2a] hover:bg-[#1a1a1a] card1"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            variants={{
              visible: { opacity: 1, scale: 1 },
              hidden: { opacity: 0, scale: 0 },
            }}
            href="/radio"
          >
            <figure className="px-10 pt-10">
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
                  d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
                />
              </svg>
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title">Listen to beats!</h2>
              <p>Who doesn&apos;t love some nice smooth beats?</p>
            </div>
          </motion.a>
          <br />
          <AnimatePresence>
            <motion.a
              className="z-40 card  bg-base-100 rounded-3xl border border-[#2a2a2a] hover:bg-[#1a1a1a] card1"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              variants={{
                visible: { opacity: 1, scale: 1 },
                hidden: { opacity: 0, scale: 0 },
              }}
              href="/radio"
            >
              <figure className="px-10 pt-10">
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
                    d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z"
                  />
                </svg>
              </figure>
              <div className="card-body items-center text-center">
                <h2 className="card-title">Support your favs</h2>
                <p>Give heat and push songs to the top!</p>
              </div>
            </motion.a>
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        <motion.div
          className="hero "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="hero-content flex-col lg:flex-row">
            <Image
              height={500}
              width={500}
              id="hero"
              src="/music.png"
              alt="hero"
              priority
            />
            <div>
              <h1 className="text-5xl font-bold">
                Start <span className="text-green-500">earning</span> today!
              </h1>
              <p className="py-6 text-2xl">
                It&apos;s as easy as{' '}
                <a
                  className="text-white link link-hover underline"
                  href="/upload"
                >
                  uploading a beat!
                </a>
              </p>
              <a href="/upload" className="btn rounded-xl btn-outline">
                Get Started
              </a>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <Marquee gradient={false} speed={100} className=" bg-[#2a2a2a] p-1">
        <div className="flex justify-between">
          <span className="fire-emoji">🔥</span>
          <span className="fire-emoji">🔥</span>
          <span className="fire-emoji">🔥</span>
          <span className="fire-emoji">🔥</span>
          <span className="fire-emoji">🔥</span>
        </div>
      </Marquee>

      <footer className="footer items-center p-4 bottom-0 border-[#2a2a2a] border-t">
        <div className="items-center grid-flow-col ">
          <p>built with ❤️ by Chris Abdo</p>
        </div>
        <div className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
          <a
            rel="noopener noreferrer"
            target="_blank"
            href="https://www.twitter.com/abdo_eth"
            className="hover:text-primary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="fill-current"
            >
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
            </svg>
          </a>
          <a
            rel="noopener noreferrer"
            target="_blank"
            href="https://www.github.com/chrisabdo"
            className="hover:text-primary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="fill-current"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
          <a
            rel="noopener noreferrer"
            target="_blank"
            href="https://www.linkedin.com/in/christopher-abdo/"
            className="hover:text-primary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="fill-current"
            >
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Home;
