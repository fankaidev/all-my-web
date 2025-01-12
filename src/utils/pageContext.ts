interface PageContext {
    url: string;
    title: string;
}

/**
 * Collect all relevant page context
 */
export const collectPageContext = (): PageContext => {
    return {
        url: window.location.href,
        title: document.title
    };
};

export type { PageContext };
