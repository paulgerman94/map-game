SystemJS.config({
  baseURL: "/kdex/",
  paths: {
    "github:": "packages/github/",
    "npm:": "packages/npm/",
    "map-game/": "dist/client/js/"
  },
  bundles: {
    "map-game/lib.js": [
      "npm:fingerprintjs2@1.1.3/dist/fingerprint2.min.js",
      "npm:fingerprintjs2@1.1.3.json",
      "npm:react@15.0.1/react.js",
      "npm:react@15.0.1/lib/React.js",
      "npm:react@15.0.1.json",
      "npm:object-assign@4.0.1/index.js",
      "npm:react@15.0.1/lib/ReactChildren.js",
      "npm:react@15.0.1/lib/ReactComponent.js",
      "npm:react@15.0.1/lib/ReactClass.js",
      "npm:react@15.0.1/lib/ReactDOMFactories.js",
      "npm:react@15.0.1/lib/ReactElement.js",
      "npm:react@15.0.1/lib/ReactElementValidator.js",
      "npm:react@15.0.1/lib/ReactPropTypes.js",
      "npm:react@15.0.1/lib/ReactVersion.js",
      "npm:react@15.0.1/lib/onlyChild.js",
      "npm:fbjs@0.8.0/lib/warning.js",
      "npm:object-assign@4.0.1.json",
      "npm:react@15.0.1/lib/PooledClass.js",
      "npm:fbjs@0.8.0/lib/emptyFunction.js",
      "npm:react@15.0.1/lib/traverseAllChildren.js",
      "npm:react@15.0.1/lib/ReactNoopUpdateQueue.js",
      "npm:react@15.0.1/lib/ReactInstrumentation.js",
      "npm:react@15.0.1/lib/canDefineProperty.js",
      "npm:fbjs@0.8.0/lib/emptyObject.js",
      "npm:fbjs@0.8.0/lib/invariant.js",
      "npm:react@15.0.1/lib/ReactPropTypeLocations.js",
      "npm:react@15.0.1/lib/ReactPropTypeLocationNames.js",
      "npm:fbjs@0.8.0/lib/keyMirror.js",
      "npm:fbjs@0.8.0/lib/keyOf.js",
      "npm:fbjs@0.8.0/lib/mapObject.js",
      "npm:react@15.0.1/lib/ReactCurrentOwner.js",
      "npm:react@15.0.1/lib/getIteratorFn.js",
      "npm:fbjs@0.8.0.json",
      "npm:react@15.0.1/lib/ReactDebugTool.js",
      "npm:react@15.0.1/lib/ReactInvalidSetStateWarningDevTool.js",
      "github:jspm/nodelibs-process@0.2.0-alpha.json",
      "github:jspm/nodelibs-process@0.2.0-alpha/process.js",
      "npm:react-router@2.0.1/lib/index.js",
      "npm:react-router@2.0.1/lib/Router.js",
      "npm:react-router@2.0.1/lib/Link.js",
      "npm:react-router@2.0.1/lib/IndexLink.js",
      "npm:react-router@2.0.1/lib/IndexRedirect.js",
      "npm:react-router@2.0.1/lib/IndexRoute.js",
      "npm:react-router@2.0.1/lib/Redirect.js",
      "npm:react-router@2.0.1/lib/Route.js",
      "npm:react-router@2.0.1/lib/History.js",
      "npm:react-router@2.0.1/lib/Lifecycle.js",
      "npm:react-router@2.0.1/lib/RouteContext.js",
      "npm:react-router@2.0.1/lib/useRoutes.js",
      "npm:react-router@2.0.1/lib/RouteUtils.js",
      "npm:react-router@2.0.1/lib/RouterContext.js",
      "npm:react-router@2.0.1/lib/RoutingContext.js",
      "npm:react-router@2.0.1/lib/PropTypes.js",
      "npm:react-router@2.0.1/lib/match.js",
      "npm:react-router@2.0.1/lib/useRouterHistory.js",
      "npm:react-router@2.0.1/lib/PatternUtils.js",
      "npm:react-router@2.0.1/lib/browserHistory.js",
      "npm:react-router@2.0.1/lib/hashHistory.js",
      "npm:react-router@2.0.1/lib/createMemoryHistory.js",
      "npm:react-router@2.0.1.json",
      "npm:history@2.0.1/lib/createHashHistory.js",
      "npm:history@2.0.1/lib/useQueries.js",
      "npm:react-router@2.0.1/lib/createTransitionManager.js",
      "npm:react-router@2.0.1/lib/RouterUtils.js",
      "npm:react-router@2.0.1/lib/routerWarning.js",
      "npm:react-router@2.0.1/lib/deprecateObjectProperties.js",
      "npm:react-router@2.0.1/lib/getRouteParams.js",
      "npm:history@2.0.1/lib/useBasename.js",
      "npm:history@2.0.1/lib/createBrowserHistory.js",
      "npm:react-router@2.0.1/lib/createRouterHistory.js",
      "npm:history@2.0.1/lib/createMemoryHistory.js",
      "npm:history@2.0.1/lib/Actions.js",
      "npm:history@2.0.1/lib/PathUtils.js",
      "npm:history@2.0.1/lib/ExecutionEnvironment.js",
      "npm:history@2.0.1/lib/DOMUtils.js",
      "npm:history@2.0.1/lib/DOMStateStorage.js",
      "npm:history@2.0.1/lib/createDOMHistory.js",
      "npm:history@2.0.1.json",
      "npm:query-string@3.0.3/index.js",
      "npm:history@2.0.1/lib/runTransitionHook.js",
      "npm:history@2.0.1/lib/deprecate.js",
      "npm:react-router@2.0.1/lib/computeChangedRoutes.js",
      "npm:react-router@2.0.1/lib/TransitionUtils.js",
      "npm:react-router@2.0.1/lib/isActive.js",
      "npm:react-router@2.0.1/lib/getComponents.js",
      "npm:react-router@2.0.1/lib/matchRoutes.js",
      "npm:history@2.0.1/lib/createHistory.js",
      "npm:strict-uri-encode@1.1.0/index.js",
      "npm:query-string@3.0.3.json",
      "npm:react-router@2.0.1/lib/AsyncUtils.js",
      "npm:deep-equal@1.0.1/index.js",
      "npm:history@2.0.1/lib/AsyncUtils.js",
      "npm:history@2.0.1/lib/createLocation.js",
      "npm:strict-uri-encode@1.1.0.json",
      "npm:deep-equal@1.0.1/lib/keys.js",
      "npm:deep-equal@1.0.1/lib/is_arguments.js",
      "npm:deep-equal@1.0.1.json",
      "npm:warning@2.1.0.json",
      "npm:warning@2.1.0/browser.js",
      "npm:invariant@2.2.1.json",
      "npm:invariant@2.2.1/browser.js",
      "npm:ws-promise-client@1.3.1/dist/index.js",
      "npm:ws-promise-client@1.3.1/dist/Client.js",
      "npm:ws-promise-client@1.3.1.json",
      "npm:ip-regex@1.0.3/index.js",
      "npm:crystal-event-emitter@1.1.3/dist/index.js",
      "npm:ip-regex@1.0.3.json",
      "npm:crystal-event-emitter@1.1.3/dist/EventEmitter.js",
      "npm:crystal-event-emitter@1.1.3.json",
      "npm:pixi.js@3.0.11/src/index.js",
      "npm:pixi.js@3.0.11/src/polyfill/index.js",
      "npm:pixi.js@3.0.11/src/core/index.js",
      "npm:pixi.js@3.0.11/src/extras/index.js",
      "npm:pixi.js@3.0.11/src/filters/index.js",
      "npm:pixi.js@3.0.11/src/interaction/index.js",
      "npm:pixi.js@3.0.11/src/loaders/index.js",
      "npm:pixi.js@3.0.11/src/mesh/index.js",
      "npm:pixi.js@3.0.11/src/accessibility/index.js",
      "npm:pixi.js@3.0.11/src/deprecation.js",
      "npm:pixi.js@3.0.11.json",
      "npm:pixi.js@3.0.11/src/polyfill/Object.assign.js",
      "npm:pixi.js@3.0.11/src/polyfill/requestAnimationFrame.js",
      "npm:pixi.js@3.0.11/src/polyfill/Math.sign.js",
      "npm:pixi.js@3.0.11/src/core/const.js",
      "npm:pixi.js@3.0.11/src/core/math/index.js",
      "npm:pixi.js@3.0.11/src/core/utils/index.js",
      "npm:pixi.js@3.0.11/src/core/ticker/index.js",
      "npm:pixi.js@3.0.11/src/core/display/DisplayObject.js",
      "npm:pixi.js@3.0.11/src/core/display/Container.js",
      "npm:pixi.js@3.0.11/src/core/sprites/Sprite.js",
      "npm:pixi.js@3.0.11/src/core/particles/ParticleContainer.js",
      "npm:pixi.js@3.0.11/src/core/sprites/webgl/SpriteRenderer.js",
      "npm:pixi.js@3.0.11/src/core/particles/webgl/ParticleRenderer.js",
      "npm:pixi.js@3.0.11/src/core/text/Text.js",
      "npm:pixi.js@3.0.11/src/core/graphics/Graphics.js",
      "npm:pixi.js@3.0.11/src/core/graphics/GraphicsData.js",
      "npm:pixi.js@3.0.11/src/core/graphics/webgl/GraphicsRenderer.js",
      "npm:pixi.js@3.0.11/src/core/textures/Texture.js",
      "npm:pixi.js@3.0.11/src/core/textures/BaseTexture.js",
      "npm:pixi.js@3.0.11/src/core/textures/RenderTexture.js",
      "npm:pixi.js@3.0.11/src/core/textures/VideoBaseTexture.js",
      "npm:pixi.js@3.0.11/src/core/textures/TextureUvs.js",
      "npm:pixi.js@3.0.11/src/core/renderers/canvas/CanvasRenderer.js",
      "npm:pixi.js@3.0.11/src/core/renderers/canvas/utils/CanvasGraphics.js",
      "npm:pixi.js@3.0.11/src/core/renderers/canvas/utils/CanvasBuffer.js",
      "npm:pixi.js@3.0.11/src/core/renderers/webgl/WebGLRenderer.js",
      "npm:pixi.js@3.0.11/src/core/renderers/webgl/managers/WebGLManager.js",
      "npm:pixi.js@3.0.11/src/core/renderers/webgl/managers/ShaderManager.js",
      "npm:pixi.js@3.0.11/src/core/renderers/webgl/shaders/Shader.js",
      "npm:pixi.js@3.0.11/src/core/renderers/webgl/shaders/TextureShader.js",
      "npm:pixi.js@3.0.11/src/core/renderers/webgl/shaders/PrimitiveShader.js",
      "npm:pixi.js@3.0.11/src/core/renderers/webgl/shaders/ComplexPrimitiveShader.js",
      "npm:pixi.js@3.0.11/src/core/renderers/webgl/utils/ObjectRenderer.js",
      "npm:pixi.js@3.0.11/src/core/renderers/webgl/utils/RenderTarget.js",
      "npm:pixi.js@3.0.11/src/core/renderers/webgl/filters/AbstractFilter.js",
      "npm:pixi.js@3.0.11/src/core/renderers/webgl/filters/FXAAFilter.js",
      "npm:pixi.js@3.0.11/src/core/renderers/webgl/filters/SpriteMaskFilter.js",
      "npm:pixi.js@3.0.11/src/extras/cacheAsBitmap.js",
      "npm:pixi.js@3.0.11/src/extras/getChildByName.js",
      "npm:pixi.js@3.0.11/src/extras/getGlobalPosition.js",
      "npm:pixi.js@3.0.11/src/extras/MovieClip.js",
      "npm:pixi.js@3.0.11/src/extras/TilingSprite.js",
      "npm:pixi.js@3.0.11/src/extras/BitmapText.js",
      "npm:pixi.js@3.0.11/src/filters/ascii/AsciiFilter.js",
      "npm:pixi.js@3.0.11/src/filters/bloom/BloomFilter.js",
      "npm:pixi.js@3.0.11/src/filters/blur/BlurFilter.js",
      "npm:pixi.js@3.0.11/src/filters/blur/BlurXFilter.js",
      "npm:pixi.js@3.0.11/src/filters/blur/BlurYFilter.js",
      "npm:pixi.js@3.0.11/src/filters/blur/BlurDirFilter.js",
      "npm:pixi.js@3.0.11/src/filters/color/ColorMatrixFilter.js",
      "npm:pixi.js@3.0.11/src/filters/color/ColorStepFilter.js",
      "npm:pixi.js@3.0.11/src/filters/convolution/ConvolutionFilter.js",
      "npm:pixi.js@3.0.11/src/filters/crosshatch/CrossHatchFilter.js",
      "npm:pixi.js@3.0.11/src/filters/displacement/DisplacementFilter.js",
      "npm:pixi.js@3.0.11/src/filters/dot/DotScreenFilter.js",
      "npm:pixi.js@3.0.11/src/filters/gray/GrayFilter.js",
      "npm:pixi.js@3.0.11/src/filters/dropshadow/DropShadowFilter.js",
      "npm:pixi.js@3.0.11/src/filters/invert/InvertFilter.js",
      "npm:pixi.js@3.0.11/src/filters/noise/NoiseFilter.js",
      "npm:pixi.js@3.0.11/src/filters/pixelate/PixelateFilter.js",
      "npm:pixi.js@3.0.11/src/filters/rgb/RGBSplitFilter.js",
      "npm:pixi.js@3.0.11/src/filters/shockwave/ShockwaveFilter.js",
      "npm:pixi.js@3.0.11/src/filters/sepia/SepiaFilter.js",
      "npm:pixi.js@3.0.11/src/filters/blur/SmartBlurFilter.js",
      "npm:pixi.js@3.0.11/src/filters/tiltshift/TiltShiftFilter.js",
      "npm:pixi.js@3.0.11/src/filters/tiltshift/TiltShiftXFilter.js",
      "npm:pixi.js@3.0.11/src/filters/tiltshift/TiltShiftYFilter.js",
      "npm:pixi.js@3.0.11/src/filters/twist/TwistFilter.js",
      "npm:pixi.js@3.0.11/src/interaction/InteractionData.js",
      "npm:pixi.js@3.0.11/src/interaction/InteractionManager.js",
      "npm:pixi.js@3.0.11/src/interaction/interactiveTarget.js",
      "npm:pixi.js@3.0.11/src/loaders/loader.js",
      "npm:pixi.js@3.0.11/src/loaders/bitmapFontParser.js",
      "npm:pixi.js@3.0.11/src/loaders/spritesheetParser.js",
      "npm:pixi.js@3.0.11/src/loaders/textureParser.js",
      "npm:resource-loader@1.6.4/src/index.js",
      "npm:pixi.js@3.0.11/src/mesh/Mesh.js",
      "npm:pixi.js@3.0.11/src/mesh/Plane.js",
      "npm:pixi.js@3.0.11/src/mesh/Rope.js",
      "npm:pixi.js@3.0.11/src/mesh/webgl/MeshRenderer.js",
      "npm:pixi.js@3.0.11/src/mesh/webgl/MeshShader.js",
      "npm:pixi.js@3.0.11/src/accessibility/accessibleTarget.js",
      "npm:pixi.js@3.0.11/src/accessibility/AccessibilityManager.js",
      "npm:pixi.js@3.0.11/src/core/math/Point.js",
      "npm:pixi.js@3.0.11/src/core/math/Matrix.js",
      "npm:pixi.js@3.0.11/src/core/math/GroupD8.js",
      "npm:pixi.js@3.0.11/src/core/math/shapes/Circle.js",
      "npm:pixi.js@3.0.11/src/core/math/shapes/Ellipse.js",
      "npm:pixi.js@3.0.11/src/core/math/shapes/Polygon.js",
      "npm:pixi.js@3.0.11/src/core/math/shapes/Rectangle.js",
      "npm:pixi.js@3.0.11/src/core/math/shapes/RoundedRectangle.js",
      "npm:eventemitter3@1.2.0/index.js",
      "npm:pixi.js@3.0.11/src/core/utils/pluginTarget.js",
      "npm:async@1.5.2/lib/async.js",
      "npm:pixi.js@3.0.11/src/core/ticker/Ticker.js",
      "npm:pixi.js@3.0.11/src/core/renderers/canvas/utils/CanvasTinter.js",
      "npm:pixi.js@3.0.11/src/core/particles/webgl/ParticleShader.js",
      "npm:pixi.js@3.0.11/src/core/particles/webgl/ParticleBuffer.js",
      "npm:pixi.js@3.0.11/src/core/graphics/webgl/WebGLGraphicsData.js",
      "npm:earcut@2.1.1/src/earcut.js",
      "npm:pixi.js@3.0.11/src/core/renderers/webgl/managers/FilterManager.js",
      "npm:pixi.js@3.0.11/src/core/renderers/SystemRenderer.js",
      "npm:pixi.js@3.0.11/src/core/renderers/canvas/utils/CanvasMaskManager.js",
      "npm:pixi.js@3.0.11/src/core/renderers/webgl/managers/MaskManager.js",
      "npm:pixi.js@3.0.11/src/core/renderers/webgl/managers/StencilManager.js",
      "npm:pixi.js@3.0.11/src/core/renderers/webgl/managers/BlendModeManager.js",
      "npm:pixi.js@3.0.11/src/core/renderers/webgl/utils/StencilMaskStack.js",
      "npm:pixi.js@3.0.11/src/filters/dropshadow/BlurYTintFilter.js",
      "npm:pixi.js@3.0.11/src/filters/tiltshift/TiltShiftAxisFilter.js",
      "npm:resource-loader@1.6.4/src/Loader.js",
      "npm:resource-loader@1.6.4/src/Resource.js",
      "npm:resource-loader@1.6.4/src/middlewares/caching/memory.js",
      "npm:resource-loader@1.6.4/src/middlewares/parsing/blob.js",
      "npm:resource-loader@1.6.4.json",
      "npm:eventemitter3@1.2.0.json",
      "npm:async@1.5.2.json",
      "npm:earcut@2.1.1.json",
      "npm:pixi.js@3.0.11/src/core/renderers/webgl/utils/Quad.js",
      "npm:async@0.9.2/lib/async.js",
      "npm:resource-loader@1.6.4/src/b64.js",
      "npm:async@0.9.2.json",
      "github:jspm/nodelibs-fs@0.2.0-alpha.json",
      "github:jspm/nodelibs-fs@0.2.0-alpha/fs.js",
      "github:jspm/nodelibs-path@0.2.0-alpha.json",
      "github:jspm/nodelibs-path@0.2.0-alpha/path.js",
      "github:jspm/nodelibs-url@0.2.0-alpha.json",
      "npm:url@0.11.0/url.js",
      "npm:punycode@1.3.2/punycode.js",
      "npm:url@0.11.0/util.js",
      "npm:querystring@0.2.0/index.js",
      "npm:url@0.11.0.json",
      "npm:punycode@1.3.2.json",
      "npm:querystring@0.2.0/decode.js",
      "npm:querystring@0.2.0/encode.js",
      "npm:querystring@0.2.0.json",
      "npm:react-dom@15.0.1/index.js",
      "npm:react-bootstrap@0.28.5/lib/index.js",
      "npm:react-dom@15.0.1.json",
      "npm:react-bootstrap@0.28.5.json",
      "npm:babel-runtime@5.8.38/helpers/interop-require-wildcard.js",
      "npm:react-bootstrap@0.28.5/lib/utils/createChainedFunction.js",
      "npm:babel-runtime@5.8.38/helpers/interop-require-default.js",
      "npm:react-bootstrap@0.28.5/lib/utils/ValidComponentChildren.js",
      "npm:react-bootstrap@0.28.5/lib/Accordion.js",
      "npm:react-bootstrap@0.28.5/lib/ButtonInput.js",
      "npm:react-bootstrap@0.28.5/lib/Input.js",
      "npm:react-bootstrap@0.28.5/lib/Interpolate.js",
      "npm:react-bootstrap@0.28.5/lib/NavBrand.js",
      "npm:react-bootstrap@0.28.5/lib/NavDropdown.js",
      "npm:react-bootstrap@0.28.5/lib/SafeAnchor.js",
      "npm:react-bootstrap@0.28.5/lib/FormControls/index.js",
      "npm:react@15.0.1/lib/ReactDOM.js",
      "npm:react-bootstrap@0.28.5/lib/Alert.js",
      "npm:react-bootstrap@0.28.5/lib/Badge.js",
      "npm:react-bootstrap@0.28.5/lib/Breadcrumb.js",
      "npm:react-bootstrap@0.28.5/lib/BreadcrumbItem.js",
      "npm:react-bootstrap@0.28.5/lib/ButtonToolbar.js",
      "npm:react-bootstrap@0.28.5/lib/Carousel.js",
      "npm:react-bootstrap@0.28.5/lib/CarouselItem.js",
      "npm:react-bootstrap@0.28.5/lib/CollapsibleNav.js",
      "npm:react-bootstrap@0.28.5/lib/Glyphicon.js",
      "npm:react-bootstrap@0.28.5/lib/Image.js",
      "npm:react-bootstrap@0.28.5/lib/Label.js",
      "npm:react-bootstrap@0.28.5/lib/ListGroup.js",
      "npm:react-bootstrap@0.28.5/lib/ListGroupItem.js",
      "npm:react-bootstrap@0.28.5/lib/ModalBody.js",
      "npm:react-bootstrap@0.28.5/lib/ModalFooter.js",
      "npm:react-bootstrap@0.28.5/lib/ModalHeader.js",
      "npm:react-bootstrap@0.28.5/lib/ModalTitle.js",
      "npm:react-bootstrap@0.28.5/lib/NavbarBrand.js",
      "npm:react-bootstrap@0.28.5/lib/NavItem.js",
      "npm:react-bootstrap@0.28.5/lib/PageHeader.js",
      "npm:react-bootstrap@0.28.5/lib/PageItem.js",
      "npm:react-bootstrap@0.28.5/lib/Pager.js",
      "npm:react-bootstrap@0.28.5/lib/Panel.js",
      "npm:react-bootstrap@0.28.5/lib/PanelGroup.js",
      "npm:react-bootstrap@0.28.5/lib/ProgressBar.js",
      "npm:react-bootstrap@0.28.5/lib/Tab.js",
      "npm:react-bootstrap@0.28.5/lib/Table.js",
      "npm:react-bootstrap@0.28.5/lib/Thumbnail.js",
      "npm:react-bootstrap@0.28.5/lib/Well.js",
      "npm:react-bootstrap@0.28.5/lib/DropdownButton.js",
      "npm:react-bootstrap@0.28.5/lib/SplitButton.js",
      "npm:react-bootstrap@0.28.5/lib/Tabs.js",
      "npm:react-bootstrap@0.28.5/lib/utils/childrenValueInputValidation.js",
      "npm:react-bootstrap@0.28.5/lib/ButtonGroup.js",
      "npm:react-bootstrap@0.28.5/lib/Button.js",
      "npm:react-bootstrap@0.28.5/lib/Clearfix.js",
      "npm:react-bootstrap@0.28.5/lib/Col.js",
      "npm:react-bootstrap@0.28.5/lib/Dropdown.js",
      "npm:react-bootstrap@0.28.5/lib/Grid.js",
      "npm:react-bootstrap@0.28.5/lib/Jumbotron.js",
      "npm:react-bootstrap@0.28.5/lib/MenuItem.js",
      "npm:react-bootstrap@0.28.5/lib/Media.js",
      "npm:react-bootstrap@0.28.5/lib/Nav.js",
      "npm:react-bootstrap@0.28.5/lib/Navbar.js",
      "npm:react-bootstrap@0.28.5/lib/Overlay.js",
      "npm:react-bootstrap@0.28.5/lib/Pagination.js",
      "npm:react-bootstrap@0.28.5/lib/Popover.js",
      "npm:react-bootstrap@0.28.5/lib/Row.js",
      "npm:react-bootstrap@0.28.5/lib/Tooltip.js",
      "npm:react-bootstrap@0.28.5/lib/Fade.js",
      "npm:react-bootstrap@0.28.5/lib/utils/bootstrapUtils.js",
      "npm:react-bootstrap@0.28.5/lib/OverlayTrigger.js",
      "npm:react-bootstrap@0.28.5/lib/ResponsiveEmbed.js",
      "npm:react-bootstrap@0.28.5/lib/Modal.js",
      "npm:react-bootstrap@0.28.5/lib/Collapse.js",
      "npm:babel-runtime@5.8.38.json",
      "npm:babel-runtime@5.8.38/helpers/class-call-check.js",
      "npm:babel-runtime@5.8.38/helpers/object-without-properties.js",
      "npm:react@15.0.1/lib/ReactPerf.js",
      "npm:react@15.0.1/lib/ReactReconciler.js",
      "npm:react@15.0.1/lib/renderSubtreeIntoContainer.js",
      "npm:react@15.0.1/lib/getNativeComponentFromComposite.js",
      "npm:fbjs@0.8.0/lib/ExecutionEnvironment.js",
      "npm:babel-runtime@5.8.38/helpers/inherits.js",
      "npm:react-bootstrap@0.28.5/lib/FormGroup.js",
      "npm:react-bootstrap@0.28.5/lib/InputBase.js",
      "npm:react-bootstrap@0.28.5/lib/utils/deprecationWarning.js",
      "npm:babel-runtime@5.8.38/helpers/extends.js",
      "npm:react-bootstrap@0.28.5/lib/FormControls/Static.js",
      "npm:react@15.0.1/lib/ReactDOMComponentTree.js",
      "npm:react@15.0.1/lib/ReactDefaultInjection.js",
      "npm:react@15.0.1/lib/ReactMount.js",
      "npm:react@15.0.1/lib/ReactUpdates.js",
      "npm:react@15.0.1/lib/findDOMNode.js",
      "npm:classnames@2.2.3/index.js",
      "npm:react-prop-types@0.3.0/lib/singlePropFrom.js",
      "npm:keycode@2.1.1/index.js",
      "npm:react-prop-types@0.3.0/lib/all.js",
      "npm:react-prop-types@0.3.0/lib/isRequiredForA11y.js",
      "npm:dom-helpers@2.4.0/util/inDOM.js",
      "npm:dom-helpers@2.4.0/ownerDocument.js",
      "npm:react-bootstrap@0.28.5/lib/utils/TransitionEvents.js",
      "npm:lodash-compat@3.10.2/object/omit.js",
      "npm:lodash-compat@3.10.2/object/pick.js",
      "npm:react-prop-types@0.3.0/lib/elementType.js",
      "npm:dom-helpers@2.4.0/activeElement.js",
      "npm:dom-helpers@2.4.0/query/contains.js",
      "npm:lodash-compat@3.10.2/collection/find.js",
      "npm:uncontrollable@3.2.3/index.js",
      "npm:dom-helpers@2.4.0/util/scrollbarSize.js",
      "npm:dom-helpers@2.4.0/events/index.js",
      "npm:dom-helpers@2.4.0/style/index.js",
      "npm:react-bootstrap@0.28.5/lib/CarouselCaption.js",
      "npm:react-bootstrap@0.28.5/lib/SplitToggle.js",
      "npm:react-bootstrap@0.28.5/lib/DropdownMenu.js",
      "npm:react-bootstrap@0.28.5/lib/DropdownToggle.js",
      "npm:react-bootstrap@0.28.5/lib/utils/CustomPropTypes.js",
      "npm:react-bootstrap@0.28.5/lib/MediaHeading.js",
      "npm:react-bootstrap@0.28.5/lib/MediaBody.js",
      "npm:react-bootstrap@0.28.5/lib/MediaLeft.js",
      "npm:react-bootstrap@0.28.5/lib/MediaRight.js",
      "npm:react-bootstrap@0.28.5/lib/MediaList.js",
      "npm:react-prop-types@0.3.0/lib/deprecated.js",
      "npm:react-bootstrap@0.28.5/lib/MediaListItem.js",
      "npm:react-bootstrap@0.28.5/lib/deprecated/Navbar.js",
      "npm:react-bootstrap@0.28.5/lib/styleMaps.js",
      "npm:react-bootstrap@0.28.5/lib/NavbarHeader.js",
      "npm:react-bootstrap@0.28.5/lib/NavbarToggle.js",
      "npm:react-bootstrap@0.28.5/lib/NavbarCollapse.js",
      "npm:react-bootstrap@0.28.5/lib/PaginationButton.js",
      "npm:react-overlays@0.6.3/lib/Transition.js",
      "npm:react-bootstrap@0.28.5/lib/ModalDialog.js",
      "npm:react-overlays@0.6.3/lib/utils/isOverflowing.js",
      "npm:babel-runtime@5.8.38/core-js/object/keys.js",
      "npm:babel-runtime@5.8.38/core-js/object/assign.js",
      "npm:react-overlays@0.6.3/lib/Overlay.js",
      "npm:react-overlays@0.6.3/lib/Modal.js",
      "npm:react@15.0.1/lib/ReactRef.js",
      "npm:babel-runtime@5.8.38/core-js/object/create.js",
      "npm:babel-runtime@5.8.38/core-js/object/set-prototype-of.js",
      "npm:react@15.0.1/lib/ReactDOMComponentFlags.js",
      "npm:react@15.0.1/lib/HTMLDOMPropertyConfig.js",
      "npm:react@15.0.1/lib/ReactComponentBrowserEnvironment.js",
      "npm:react@15.0.1/lib/ReactInjection.js",
      "npm:react@15.0.1/lib/SVGDOMPropertyConfig.js",
      "npm:react@15.0.1/lib/DOMLazyTree.js",
      "npm:react@15.0.1/lib/ReactDOMContainerInfo.js",
      "npm:react@15.0.1/lib/ReactDOMFeatureFlags.js",
      "npm:react@15.0.1/lib/ReactFeatureFlags.js",
      "npm:react@15.0.1/lib/ReactMarkupChecksum.js",
      "npm:react@15.0.1/lib/shouldUpdateReactComponent.js",
      "npm:react@15.0.1/lib/ReactInstanceMap.js",
      "npm:react@15.0.1/lib/ReactNodeTypes.js",
      "npm:react@15.0.1/lib/DOMProperty.js",
      "npm:react@15.0.1/lib/BeforeInputEventPlugin.js",
      "npm:react@15.0.1/lib/DefaultEventPluginOrder.js",
      "npm:react@15.0.1/lib/ChangeEventPlugin.js",
      "npm:react@15.0.1/lib/EnterLeaveEventPlugin.js",
      "npm:react@15.0.1/lib/ReactDOMEmptyComponent.js",
      "npm:react@15.0.1/lib/ReactDOMTreeTraversal.js",
      "npm:react@15.0.1/lib/ReactDOMComponent.js",
      "npm:react@15.0.1/lib/ReactDOMTextComponent.js",
      "npm:react@15.0.1/lib/ReactEventListener.js",
      "npm:react@15.0.1/lib/ReactDefaultBatchingStrategy.js",
      "npm:react@15.0.1/lib/ReactReconcileTransaction.js",
      "npm:react@15.0.1/lib/SelectEventPlugin.js",
      "npm:react@15.0.1/lib/SimpleEventPlugin.js",
      "npm:react@15.0.1/lib/ReactDefaultPerf.js",
      "npm:react@15.0.1/lib/ReactBrowserEventEmitter.js",
      "npm:react@15.0.1/lib/ReactUpdateQueue.js",
      "npm:react@15.0.1/lib/setInnerHTML.js",
      "npm:react@15.0.1/lib/instantiateReactComponent.js",
      "npm:react@15.0.1/lib/CallbackQueue.js",
      "npm:react@15.0.1/lib/Transaction.js",
      "npm:classnames@2.2.3.json",
      "npm:react-prop-types@0.3.0.json",
      "npm:keycode@2.1.1.json",
      "npm:dom-helpers@2.4.0.json",
      "npm:lodash-compat@3.10.2.json",
      "npm:lodash-compat@3.10.2/function/restParam.js",
      "npm:react-prop-types@0.3.0/lib/common.js",
      "npm:lodash-compat@3.10.2/internal/arrayMap.js",
      "npm:uncontrollable@3.2.3.json",
      "npm:dom-helpers@2.4.0/style/removeStyle.js",
      "npm:react-overlays@0.6.3.json",
      "npm:dom-helpers@2.4.0/query/isWindow.js",
      "npm:lodash-compat@3.10.2/internal/baseDifference.js",
      "npm:lodash-compat@3.10.2/internal/baseFlatten.js",
      "npm:lodash-compat@3.10.2/internal/bindCallback.js",
      "npm:lodash-compat@3.10.2/object/keysIn.js",
      "npm:lodash-compat@3.10.2/internal/pickByArray.js",
      "npm:lodash-compat@3.10.2/internal/pickByCallback.js",
      "npm:lodash-compat@3.10.2/internal/baseEach.js",
      "npm:lodash-compat@3.10.2/internal/createFind.js",
      "npm:uncontrollable@3.2.3/createUncontrollable.js",
      "npm:dom-helpers@2.4.0/events/off.js",
      "npm:dom-helpers@2.4.0/events/on.js",
      "npm:dom-helpers@2.4.0/events/filter.js",
      "npm:dom-helpers@2.4.0/util/camelizeStyle.js",
      "npm:dom-helpers@2.4.0/util/hyphenateStyle.js",
      "npm:react-overlays@0.6.3/lib/RootCloseWrapper.js",
      "npm:react-bootstrap@0.28.5/lib/utils/createSelectedEvent.js",
      "npm:dom-helpers@2.4.0/style/getComputedStyle.js",
      "npm:dom-helpers@2.4.0/transition/properties.js",
      "npm:react-bootstrap@0.28.5/lib/utils/childrenToArray.js",
      "npm:dom-helpers@2.4.0/util/babelHelpers.js",
      "npm:react-overlays@0.6.3/lib/utils/addFocusListener.js",
      "npm:core-js@1.2.6/library/fn/object/keys.js",
      "npm:core-js@1.2.6/library/fn/object/assign.js",
      "npm:react-prop-types@0.2.2/lib/elementType.js",
      "npm:react-prop-types@0.2.2/lib/mountable.js",
      "npm:react-overlays@0.6.3/lib/utils/getContainer.js",
      "npm:react-overlays@0.6.3/lib/Portal.js",
      "npm:react-overlays@0.6.3/lib/Position.js",
      "npm:react-overlays@0.6.3/lib/utils/ownerDocument.js",
      "npm:react-overlays@0.6.3/lib/utils/addEventListener.js",
      "npm:react-overlays@0.6.3/lib/ModalManager.js",
      "npm:core-js@1.2.6/library/fn/object/create.js",
      "npm:core-js@1.2.6/library/fn/object/set-prototype-of.js",
      "npm:react@15.0.1/lib/DOMChildrenOperations.js",
      "npm:react@15.0.1/lib/ReactDOMIDOperations.js",
      "npm:react@15.0.1/lib/ReactEmptyComponent.js",
      "npm:react@15.0.1/lib/createMicrosoftUnsafeLocalFunction.js",
      "npm:react@15.0.1/lib/adler32.js",
      "npm:react@15.0.1/lib/SyntheticCompositionEvent.js",
      "npm:react@15.0.1/lib/SyntheticInputEvent.js",
      "npm:react@15.0.1/lib/getEventTarget.js",
      "npm:react@15.0.1/lib/isTextInputElement.js",
      "npm:react@15.0.1/lib/SyntheticMouseEvent.js",
      "npm:react@15.0.1/lib/DOMNamespaces.js",
      "npm:react@15.0.1/lib/ReactDOMButton.js",
      "npm:react@15.0.1/lib/escapeTextContentForBrowser.js",
      "npm:fbjs@0.8.0/lib/shallowEqual.js",
      "npm:fbjs@0.8.0/lib/EventListener.js",
      "npm:fbjs@0.8.0/lib/getUnboundedScrollPosition.js",
      "npm:fbjs@0.8.0/lib/getActiveElement.js",
      "npm:react@15.0.1/lib/SyntheticAnimationEvent.js",
      "npm:react@15.0.1/lib/SyntheticClipboardEvent.js",
      "npm:react@15.0.1/lib/SyntheticFocusEvent.js",
      "npm:react@15.0.1/lib/SyntheticKeyboardEvent.js",
      "npm:react@15.0.1/lib/SyntheticDragEvent.js",
      "npm:react@15.0.1/lib/SyntheticTouchEvent.js",
      "npm:react@15.0.1/lib/SyntheticTransitionEvent.js",
      "npm:react@15.0.1/lib/SyntheticUIEvent.js",
      "npm:react@15.0.1/lib/SyntheticWheelEvent.js",
      "npm:react@15.0.1/lib/getEventCharCode.js",
      "npm:fbjs@0.8.0/lib/performanceNow.js",
      "npm:react@15.0.1/lib/ReactEventEmitterMixin.js",
      "npm:react@15.0.1/lib/ViewportMetrics.js",
      "npm:react@15.0.1/lib/ReactOwner.js",
      "npm:react@15.0.1/lib/EventPluginHub.js",
      "npm:react@15.0.1/lib/EventPluginUtils.js",
      "npm:react@15.0.1/lib/ReactComponentEnvironment.js",
      "npm:react@15.0.1/lib/ReactNativeComponent.js",
      "npm:react@15.0.1/lib/setTextContent.js",
      "npm:react@15.0.1/lib/validateDOMNesting.js",
      "npm:react@15.0.1/lib/EventConstants.js",
      "npm:react@15.0.1/lib/EventPropagators.js",
      "npm:react@15.0.1/lib/FallbackCompositionState.js",
      "npm:react@15.0.1/lib/SyntheticEvent.js",
      "npm:react@15.0.1/lib/isEventSupported.js",
      "npm:react@15.0.1/lib/AutoFocusUtils.js",
      "npm:react@15.0.1/lib/CSSPropertyOperations.js",
      "npm:react@15.0.1/lib/DOMPropertyOperations.js",
      "npm:react@15.0.1/lib/EventPluginRegistry.js",
      "npm:react@15.0.1/lib/ReactDOMInput.js",
      "npm:react@15.0.1/lib/ReactDOMOption.js",
      "npm:react@15.0.1/lib/ReactDOMSelect.js",
      "npm:react@15.0.1/lib/ReactDOMTextarea.js",
      "npm:react@15.0.1/lib/ReactMultiChild.js",
      "npm:react@15.0.1/lib/ReactInputSelection.js",
      "npm:react@15.0.1/lib/ReactDefaultPerfAnalysis.js",
      "npm:react@15.0.1/lib/getVendorPrefixedEventName.js",
      "npm:react@15.0.1/lib/ReactCompositeComponent.js",
      "npm:lodash-compat@3.10.2/internal/isObjectLike.js",
      "npm:lodash-compat@3.10.2/utility/identity.js",
      "npm:lodash-compat@3.10.2/internal/arrayEach.js",
      "npm:lodash-compat@3.10.2/internal/arrayPush.js",
      "npm:lodash-compat@3.10.2/internal/isIndex.js",
      "npm:lodash-compat@3.10.2/internal/isLength.js",
      "npm:lodash-compat@3.10.2/lang/isObject.js",
      "npm:lodash-compat@3.10.2/support.js",
      "npm:lodash-compat@3.10.2/internal/baseFind.js",
      "npm:lodash-compat@3.10.2/internal/baseFindIndex.js",
      "npm:dom-helpers@2.4.0/query/querySelectorAll.js",
      "npm:dom-helpers@2.4.0/util/hyphenate.js",
      "npm:dom-helpers@2.4.0/util/camelize.js",
      "npm:react-overlays@0.6.3/lib/utils/createChainedFunction.js",
      "npm:lodash-compat@3.10.2/internal/baseIndexOf.js",
      "npm:lodash-compat@3.10.2/internal/cacheIndexOf.js",
      "npm:lodash-compat@3.10.2/internal/createCache.js",
      "npm:lodash-compat@3.10.2/lang/isArguments.js",
      "npm:lodash-compat@3.10.2/internal/isArrayLike.js",
      "npm:lodash-compat@3.10.2/lang/isArray.js",
      "npm:lodash-compat@3.10.2/lang/isFunction.js",
      "npm:lodash-compat@3.10.2/lang/isString.js",
      "npm:lodash-compat@3.10.2/internal/toObject.js",
      "npm:lodash-compat@3.10.2/internal/baseForIn.js",
      "npm:lodash-compat@3.10.2/internal/baseForOwn.js",
      "npm:lodash-compat@3.10.2/internal/createBaseEach.js",
      "npm:lodash-compat@3.10.2/internal/baseCallback.js",
      "npm:uncontrollable@3.2.3/utils.js",
      "npm:react-prop-types@0.2.2/lib/common.js",
      "npm:core-js@1.2.6.json",
      "npm:react-prop-types@0.2.2.json",
      "npm:react-overlays@0.6.3/lib/utils/manageAriaHidden.js",
      "npm:core-js@1.2.6/library/modules/$.core.js",
      "npm:core-js@1.2.6/library/modules/es6.object.assign.js",
      "npm:dom-helpers@2.4.0/class/index.js",
      "npm:core-js@1.2.6/library/modules/es6.object.keys.js",
      "npm:react-overlays@0.6.3/lib/utils/overlayPositionUtils.js",
      "npm:core-js@1.2.6/library/modules/$.js",
      "npm:core-js@1.2.6/library/modules/es6.object.set-prototype-of.js",
      "npm:react@15.0.1/lib/getEventKey.js",
      "npm:fbjs@0.8.0/lib/performance.js",
      "npm:react@15.0.1/lib/getEventModifierState.js",
      "npm:react@15.0.1/lib/ReactErrorUtils.js",
      "npm:react@15.0.1/lib/forEachAccumulated.js",
      "npm:fbjs@0.8.0/lib/focusNode.js",
      "npm:react@15.0.1/lib/CSSProperty.js",
      "npm:fbjs@0.8.0/lib/camelizeStyleName.js",
      "npm:fbjs@0.8.0/lib/memoizeStringOnly.js",
      "npm:fbjs@0.8.0/lib/hyphenateStyleName.js",
      "npm:react@15.0.1/lib/ReactDOMInstrumentation.js",
      "npm:react@15.0.1/lib/quoteAttributeValueForBrowser.js",
      "npm:fbjs@0.8.0/lib/containsNode.js",
      "npm:react@15.0.1/lib/Danger.js",
      "npm:react@15.0.1/lib/ReactMultiChildUpdateTypes.js",
      "npm:react@15.0.1/lib/accumulateInto.js",
      "npm:react@15.0.1/lib/getTextContentAccessor.js",
      "npm:react@15.0.1/lib/dangerousStyleValue.js",
      "npm:react@15.0.1/lib/ReactChildReconciler.js",
      "npm:react@15.0.1/lib/LinkedValueUtils.js",
      "npm:react@15.0.1/lib/flattenChildren.js",
      "npm:react@15.0.1/lib/ReactDOMSelection.js",
      "npm:lodash-compat@3.10.2/internal/indexOfNaN.js",
      "npm:lodash-compat@3.10.2/internal/SetCache.js",
      "npm:lodash-compat@3.10.2/internal/getLength.js",
      "npm:lodash-compat@3.10.2/internal/baseFor.js",
      "npm:lodash-compat@3.10.2/object/keys.js",
      "npm:lodash-compat@3.10.2/internal/baseMatches.js",
      "npm:lodash-compat@3.10.2/internal/baseMatchesProperty.js",
      "npm:lodash-compat@3.10.2/utility/property.js",
      "npm:lodash-compat@3.10.2/internal/getNative.js",
      "npm:dom-helpers@2.4.0/class/removeClass.js",
      "npm:dom-helpers@2.4.0/class/hasClass.js",
      "npm:core-js@1.2.6/library/modules/$.export.js",
      "npm:dom-helpers@2.4.0/class/addClass.js",
      "npm:core-js@1.2.6/library/modules/$.object-assign.js",
      "npm:core-js@1.2.6/library/modules/$.to-object.js",
      "npm:core-js@1.2.6/library/modules/$.object-sap.js",
      "npm:dom-helpers@2.4.0/query/offset.js",
      "npm:dom-helpers@2.4.0/query/scrollTop.js",
      "npm:dom-helpers@2.4.0/query/position.js",
      "npm:core-js@1.2.6/library/modules/$.set-proto.js",
      "npm:fbjs@0.8.0/lib/hyphenate.js",
      "npm:fbjs@0.8.0/lib/isTextNode.js",
      "npm:fbjs@0.8.0/lib/camelize.js",
      "npm:fbjs@0.8.0/lib/createNodesFromMarkup.js",
      "npm:fbjs@0.8.0/lib/getMarkupWrap.js",
      "npm:react@15.0.1/lib/getNodeForCharacterOffset.js",
      "npm:react@15.0.1/lib/ReactDOMDebugTool.js",
      "npm:lodash-compat@3.10.2/internal/baseSlice.js",
      "npm:lodash-compat@3.10.2/array/last.js",
      "npm:lodash-compat@3.10.2/internal/createBaseFor.js",
      "npm:lodash-compat@3.10.2/internal/shimKeys.js",
      "npm:lodash-compat@3.10.2/internal/baseIsMatch.js",
      "npm:lodash-compat@3.10.2/internal/getMatchData.js",
      "npm:lodash-compat@3.10.2/internal/baseGet.js",
      "npm:lodash-compat@3.10.2/internal/isKey.js",
      "npm:lodash-compat@3.10.2/internal/cachePush.js",
      "npm:lodash-compat@3.10.2/internal/baseIsEqual.js",
      "npm:lodash-compat@3.10.2/internal/baseProperty.js",
      "npm:lodash-compat@3.10.2/internal/isStrictComparable.js",
      "npm:lodash-compat@3.10.2/internal/toPath.js",
      "npm:lodash-compat@3.10.2/internal/basePropertyDeep.js",
      "npm:lodash-compat@3.10.2/lang/isNative.js",
      "npm:core-js@1.2.6/library/modules/$.global.js",
      "npm:core-js@1.2.6/library/modules/$.ctx.js",
      "npm:core-js@1.2.6/library/modules/$.defined.js",
      "npm:core-js@1.2.6/library/modules/$.iobject.js",
      "npm:core-js@1.2.6/library/modules/$.fails.js",
      "npm:dom-helpers@2.4.0/query/scrollLeft.js",
      "npm:dom-helpers@2.4.0/query/offsetParent.js",
      "npm:fbjs@0.8.0/lib/isNode.js",
      "npm:fbjs@0.8.0/lib/createArrayFromMixed.js",
      "npm:core-js@1.2.6/library/modules/$.is-object.js",
      "npm:core-js@1.2.6/library/modules/$.an-object.js",
      "npm:react@15.0.1/lib/ReactDOMUnknownPropertyDevtool.js",
      "npm:lodash-compat@3.10.2/internal/isHostObject.js",
      "npm:lodash-compat@3.10.2/internal/baseToString.js",
      "npm:lodash-compat@3.10.2/object/pairs.js",
      "npm:lodash-compat@3.10.2/internal/baseIsEqualDeep.js",
      "npm:core-js@1.2.6/library/modules/$.a-function.js",
      "npm:core-js@1.2.6/library/modules/$.cof.js",
      "npm:lodash-compat@3.10.2/internal/equalArrays.js",
      "npm:lodash-compat@3.10.2/internal/equalByTag.js",
      "npm:lodash-compat@3.10.2/internal/equalObjects.js",
      "npm:lodash-compat@3.10.2/lang/isTypedArray.js",
      "npm:lodash-compat@3.10.2/internal/arraySome.js"
    ]
  }
});
