const React = require('react');

const UserViewFrontPage = ({username}) => {
  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-sm-10 col-sm-offset-1'>
          <h1>Welcome back, {username}!</h1>
          <div className='box'>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus id lacus ultrices, vulputate lectus rhoncus, sollicitudin est. Aliquam erat volutpat. Nam non tincidunt tellus. Integer finibus ipsum at lacus interdum, sed pharetra lorem rhoncus. Nulla nec lacus ex. Maecenas orci ipsum, luctus et neque ut, consectetur sagittis nisi. Fusce eu eros vel augue ultricies venenatis et sed quam. Vestibulum quis felis at libero vestibulum viverra. Maecenas eleifend consectetur facilisis. Morbi pharetra sodales ipsum, a dictum magna tincidunt id. Donec hendrerit erat mauris, a sagittis metus consectetur nec.</p>

            <p>Curabitur auctor congue mi nec rutrum. Praesent aliquet interdum velit, et pharetra nisl sagittis ac. Duis semper libero eu mi euismod ultrices. Quisque metus purus, convallis non libero id, fermentum dapibus sem. Vestibulum accumsan efficitur lacus, eget iaculis purus aliquam sit amet. Vivamus molestie tellus sit amet vestibulum interdum. Ut efficitur augue non tellus imperdiet, a fringilla nisi tincidunt. Nunc et aliquam arcu. </p>
          </div>
        </div>
      </div>
    </div>
  );
};

module.exports = UserViewFrontPage;
