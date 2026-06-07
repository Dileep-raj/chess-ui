import { ReactNode, SVGProps } from "react";

const defaultLoaderColor = "#032dd3";

interface LoaderProps extends SVGProps<SVGSVGElement> {
    /**
     * Height of the loader SVG
     */
    height?: number | string;

    /**
     * Color of the loader
     * @default "#032dd3"
     */
    color?: string;

    /**
     * Flag for inline/block element
     * @default true
     */
    inline?: boolean;
}

/**
 * 3 dots fade loader
 *
 * Source: {@link https://magecdn.com/tools/svg-loaders/loader4/ Loader4}
 */
export const ThreeDotsLoader = ({
    height = "8pt",
    color = defaultLoaderColor,
    inline = true,
    children,
    ...props
}: LoaderProps) => {
    const fillColor = color;
    return <>
        <svg
            fill={fillColor}
            viewBox="0 8 24 8"
            xmlns="http://www.w3.org/2000/svg"
            style={{ height: height, display: inline ? "inline" : "block" }}
            {...props}
        >
            <circle cx="4" cy="12" r="3" opacity="1">
                <animate
                    id="spinner_qYjJ"
                    begin="0;spinner_t4KZ.end-0.25s"
                    attributeName="opacity"
                    dur="0.75s"
                    values="1;.2"
                    fill="freeze"
                />
            </circle>
            <circle cx="12" cy="12" r="3" opacity=".4">
                <animate
                    begin="spinner_qYjJ.begin+0.15s"
                    attributeName="opacity"
                    dur="0.75s"
                    values="1;.2"
                    fill="freeze"
                />
            </circle>
            <circle cx="20" cy="12" r="3" opacity=".3">
                <animate
                    id="spinner_t4KZ"
                    begin="spinner_qYjJ.begin+0.3s"
                    attributeName="opacity"
                    dur="0.75s"
                    values="1;.2"
                    fill="freeze"
                />
            </circle>
        </svg>
        {children}
    </>
};

/**
 * Spinner 90 ring with background
 *
 * Source: {@link https://magecdn.com/tools/svg-loaders/90-ring-with-bg/ 90 Ring With Bg}
 */
export const Spinner90RingWithBg = ({
    height = "16pt",
    color = defaultLoaderColor,
    inline = true,
    children,
    ...props
}: LoaderProps) => {
    return <>
        <svg
            fill={color}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            style={{ height: height, display: inline ? "inline" : "block" }}
            {...props}
        >
            <path
                d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
                opacity=".25"
            />
            <path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z">
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    dur="0.75s"
                    values="0 12 12;360 12 12"
                    repeatCount="indefinite"
                />
            </path>
        </svg>
        {children}
    </>
};

/**
 * Circular spinner with gradient
 *
 * Source: {@link https://www.benmvp.com/blog/how-to-create-circle-svg-gradient-loading-spinner/ Gradient Spinner SVG}
 */
export const GradientSpinner = ({
    height = "16pt",
    color = defaultLoaderColor,
    inline = true,
    children,
    ...props
}: LoaderProps) => {
    return <>
        <svg
            color={color}
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            style={{ height: height, display: inline ? "inline" : "block" }}
            {...props}
        >
            <defs>
                <linearGradient id="linear-gradient1">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0.5" />
                </linearGradient>

                <linearGradient id="linear-gradient2">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0.5" />
                </linearGradient>
            </defs>
            <g strokeWidth="2.5" fill="none">
                <path stroke="url(#linear-gradient1)" d="M 18 10 A 8 8 0 0 1 2 10" />
                <path stroke="url(#linear-gradient2)" d="M 2 10 A 8 8 0 0 1 18 10" />
                <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    d="M 2 10 A 8 8 0 0 0 2 10"
                />
                <animateTransform
                    from="0 10 10"
                    to="360 10 10"
                    attributeName="transform"
                    display=""
                    type="rotate"
                    repeatCount="indefinite"
                    dur="750ms"
                />
            </g>
        </svg>
        {children}
    </>
};

/**
 * 
 * @param param0 
 * @returns 
 */
export const SingleDotLoader = ({
    height = "16pt",
    color = defaultLoaderColor,
    inline = true,
    children,
    ...props
}: LoaderProps) => {
    return <>
        <svg
            fill={color}
            viewBox="0 0 50 20"
            xmlns="http://www.w3.org/2000/svg"
            style={{ height: height, display: inline ? "inline" : "block" }}
            {...props}
        >
            <circle cx={5} cy={10} r={6}>
                <animate
                    attributeName="cx"
                    values="10;40;10"
                    dur="0.75s"
                    repeatCount="indefinite"
                />
            </circle>
        </svg>
        {children}
    </>
};
