const { ChannelType } = require('discord.js');
const VOICES = require('../../models/voices.js');

module.exports = async (Discord, client, oldState, newState) => {
    const oldVoiceGuild = oldState.guild;
    const newVoiceGuild = newState.guild;

    const oldChannel = oldState.channel;
    const newChannel = newState.channel;

    if (oldVoiceGuild === null || newVoiceGuild === null) return;
    
    ///////////////////////////// Custom VCs
    // Check a member ID, otherwise if they left the server check for a user ID
    // This also ensures that ownership is given away if a room owner was banned from the server
    const stateUserID = oldState?.member?.id || newState?.member?.id || oldState?.id || newState?.id;

    // If a user joins the room creation channel
    if ((newChannel !== null) && (newChannel.id === '1351324286782013490')) {
        const newMember = newState.member;

        if (newMember.user.bot) return;

        const roomData = await VOICES.findOne({ ownerID: stateUserID });

        // Create a new room and room data if they don't own a room
        if (!roomData) {
            const pbParent = newVoiceGuild.channels.cache.get('1351324286782013490').parent.id;

            await newVoiceGuild.channels.create({
                name: `${newState.member.displayName}'s Channel`,
                type: ChannelType.GuildVoice,
                parent: pbParent,
                userLimit: 4
            }).then(async (pRoom) => {
                const newVoice = new VOICES({
                    voiceID: pRoom.id,
                    ownerID: stateUserID
                });

                await newVoice.save().catch((err) => console.log(err));
                await newMember.voice.setChannel(pRoom.id).catch(async () => {
                    if (!newMember.voice.channel) {
                        if (newVoice) await VOICES.findOneAndDelete({ownerID: stateUserID});
                        if (pRoom) await pRoom.delete().catch((err) => console.log(err));
                    }
                });
            });
        } else {
            // Send them back to their room if they try and create duplicate rooms
            await newMember.voice.setChannel(roomData.voiceID).catch(async () => {
                if (!newMember.voice.channel) {
                    const voice = newVoiceGuild.channels.cache.get(roomData.voiceID);

                    await voice.delete().catch((err) => console.log(err));
                    await roomData.deleteOne().catch((err) => console.log(err));
                }
            });
        }
    }
// If a user leaves a channel or moves channels
    else if ((oldChannel !== null && newChannel == null) || (oldChannel !== null && newChannel !== null)) {
        const voiceSize = oldChannel.members.size;

        // If they quickly joined the room creation channel and left, delete any data or created
        // voice channels left over
        if (newChannel === null && oldChannel?.id === '1351324286782013490') {
            const roomData = await VOICES.findOne({
                ownerID: stateUserID
            });
            const createdChannel = newVoiceGuild.channels.cache.get(roomData?.voiceID);

            if (createdChannel)
                await createdChannel.delete().catch(() => {
                });

            await VOICES.findOneAndDelete({
                ownerID: stateUserID
            });
        }

        // If the room is empty, delete the room (if there's room data)
        if (voiceSize <= 0) {
            const foundData = await VOICES.findOne({ voiceID: oldChannel.id });
            if (!foundData) return; // Not a custom room (Doesn't need a room name check since there wouldn't be any
                                    // room data for normal VCs)

            const roomChannel = newVoiceGuild.channels.cache.get(foundData.voiceID);
            if (roomChannel) await roomChannel.delete().catch((err) => console.log(err));

            await VOICES.findOneAndDelete({voiceID: oldChannel.id});
        } else if (voiceSize !== 0) { // Transfer ownership to random user if owner leaves
            const transferData = await VOICES.findOne({
                voiceID: oldChannel.id
            });

            if (!transferData) return;
            if (transferData.ownerID !== stateUserID) return;

            const randomMember = oldChannel.members.random();

            if (randomMember && randomMember.user) {
                transferData.ownerID = randomMember.user.id;
                transferData.save().catch((err) => console.log(err));
            }
        }
    }
};