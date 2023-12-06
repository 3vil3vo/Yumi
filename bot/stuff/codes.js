// // draw username
// ctx.font = `bold 36px ${ops.fontX}`;
// ctx.fillStyle = this.data.username.color;
// ctx.textAlign = "start";
// const name = Util.shorten(this.data.username.name, this.data.discriminator.discrim ? 10 : 15);

// const hasHandle = typeof this.data.discriminator.discrim === 'string' && this.data.discriminator.discrim.startsWith('@');
// const yCoord = hasHandle ? 140 : 164;
// const usernameYCoord = 82;

// // apply username
// !this.data.renderEmojis ? ctx.fillText(`${name}`, 257 + 15, usernameYCoord) : await Util.renderEmoji(ctx, name, 257 + 15, usernameYCoord);

// // draw discriminator
// if (typeof this.data.discriminator.discrim === 'string') {
//     ctx.save();
//     const discrim = this.data.discriminator.discrim;
//     const discriminatorYCoord = usernameYCoord + 36; // adjust this value to move the discriminator up or down
//     const usernameXCoord = 257 + 15; // this is the x value for the username
//     if (discrim.startsWith('#')) {
//         ctx.font = `36px ${ops.fontY}`;
//         ctx.fillStyle = this.data.discriminator.color;
//         ctx.textAlign = "start";
//         ctx.fillText(discrim.substring(0, 5), usernameXCoord, discriminatorYCoord);
//     } else {
//         ctx.font = `26px ${ops.fontY}`;
//         ctx.fillStyle = this.data.discriminator.color;
//         ctx.textAlign = "start";
//         ctx.fillText(discrim, usernameXCoord, discriminatorYCoord);
//     }
//     ctx.restore();
// }