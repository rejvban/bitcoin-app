/**
 * Market hero component
 *
 * @component
 */
export const MarketHero: React.FC = () => {
  return (
    <div className="bg-gray-100">
      <div className="max-w-screen-xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <h2 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10">
          Ready to browse the market?
          <br />
          <span className="text-orange-600">Start now!</span>
        </h2>
      </div>
    </div>
  );
};
