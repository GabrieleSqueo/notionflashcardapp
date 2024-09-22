const IframeComponent = () => {
    return (
      <div className="flex justify-center">
        <iframe
          src="https://embeds.beehiiv.com/27bd7814-f01e-4fdf-99e7-07cae4974158?slim=true"
          data-test-id="beehiiv-embed"
          height="52"
          frameBorder="0"
          scrolling="no"
          className="m-0 rounded-lg w-full md:w-4/5 lg:w-4/5 xl:w-3/5 backdrop-blur-sm bg-[rgba(255,255,255,0.1)] border border-white border-opacity-30"
          title="Beehiiv Embed"
        />
      </div>
    );
  };
  
  export default IframeComponent;