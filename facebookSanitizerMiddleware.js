const { ActivityHandler, TurnContext } = require("botbuilder");

function sanitizeForFacebook(text) {
  if (!text) return text;

  return (
    text
      // Remove markdown (basic)
      .replace(/[*_~`#>]/g, "") // remove *, _, ~, `, #, >
      .replace(/\[(.*?)\]\(.*?\)/g, "$1") // [text](link) -> text
      .replace(/!\[(.*?)\]\(.*?\)/g, "") // ![img](url) -> (remove image)

      // Replace lists and bullets
      .replace(/^(\s*)[-*+]\s+/gm, "$1• ") // bullet points
      .replace(/^(\s*)\d+\.\s+/gm, "$1") // numbered lists, strip numbers

      // Normalize excessive line breaks
      .replace(/\n{3,}/g, "\n\n") // limit to 2 max
      .trim()
  );
}

const facebookSanitizerMiddleware = {
  async onTurn(context, next) {
    console.log("channelId:", context.activity.channelId);
    if (
      (context.activity.channelId === "facebook" ||
        context.activity.channelId === "emulator") &&
      context.sendActivities
    ) {
      const originalSendActivities = context.sendActivities.bind(context);
      context.sendActivities = async (activities) => {
        const sanitizedActivities = activities.map((activity) => {
          if (
            activity.type === "message" &&
            typeof activity.text === "string"
          ) {
            return {
              ...activity,
              text: sanitizeForFacebook(activity.text),
            };
          }
          return activity;
        });
        return originalSendActivities(sanitizedActivities);
      };
    }

    await next();
  },
};

module.exports = facebookSanitizerMiddleware;
