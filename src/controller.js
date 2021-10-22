class Controller {
  static async profile(ctx) {
    await ctx.render("index", {
      text: "Do not have an account?",
      page: "Sign up",
      href: "signUpName",
      description: "Sign in",
    });
  }

  static async forgotPassword(ctx) {
    await ctx.render("forgot-password", {
      text: "Back to",
      href: "home",
      page: "Sign in",
      description: "Enter your e-mail to reset your password",
    });
  }

  static async checkEmail(ctx) {
    await ctx.render("check-email", {
      text: "Back to",
      href: "home",
      page: "Sign in",
      description: "You are almost ready to go!",
    });
  }

  static async signUpName(ctx) {
    await ctx.render("sign-up-1", {
      text: "Already have an account?",
      href: "home",
      page: "Log in",
      description: "Sign up",
    });
  }

  static async signUpPassword(ctx) {
    await ctx.render("sign-up-2", {
      text: "Already have an account?",
      href: "home",
      page: "Log in",
      description: "Complete your account",
    });
  }

  static async resetPassword(ctx) {
    await ctx.render("reset-password", {
      text: "Do not have an account?",
      href: "signUpName",
      page: "Sign up",
      description: "Reset your password",
    });
  }

  static async profilePersonal(ctx) {
    await ctx.render("profile-personal", {
      location: "Home > My profile",
      account_name: "Volodya",
    });
  }

  static async profileAccount(ctx) {
    await ctx.render("profile-account", {
      location: "Home > My profile",
      account_name: "Volodya",
    });
  }

}

module.exports = {
  Controller,
};
