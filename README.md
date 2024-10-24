# Rivers

A web-based generative simulation playing with the formation and flow of waterways.

## Why?

As a challenge and a bit of fun. Like a river I have a starting point and will work out my path as I go.

## Demo

Take a look at the project in action:

| Version                | Demo Link       |
| :--------------------- | :----------------------------------------------- |
| v0.0.4 | https://mattkibbler.github.io/rivers/version-0.0.4/ |
| v0.0.3 | https://mattkibbler.github.io/rivers/version-0.0.3/ |
| v0.0.2 | https://mattkibbler.github.io/rivers/version-0.0.2/ |
| v0.0.1 | https://mattkibbler.github.io/rivers/version-0.0.1/ |

## Roadmap

- [x] Add asynchronous tile generation
- [x] Create backend service to generate and persist tiles
- [x] Add less random, more coherent tile generation
- [ ] Add zooming in/out
- [ ] Allow toggling between "windowed" and "fullscreen" modes



## Usage

### Environment variables
The following environment variables must be set in the root `.env` file.

| Key                | Value                                            |
| :--------------------- | :------------------------------------------- |
| VITE_API_URL          | The address of the tile-generation server   |

### Build commands

The project is compiled using Vite. All commands are run from the root of the project, from a terminal:

| Command                | Action                                           |
| :--------------------- | :----------------------------------------------- |
| `npm install`          | Installs dependencies                            |
| `npm run dev`          | Starts local dev server       |
| `npm run build`        | Build your production site to `./dist/`          |
| `npm run preview`      | Preview your build locally     |


## Contributing

If you'd like to contribute, please fork the repository and open a pull request to the `main` branch.
