"use strict";

const BaseListener = require("@jianghujs/jianghu-duoxing/app/listener/core/base");

/**
 * chatbot
 */
class EchoListener extends BaseListener {
  /**
   * 配置
   */
  static get config() {
    return {
      // 监听的 action 列表
      listenActions: ["userMessage", "roomMessage"],
      // 开关
      disable: false,
    };
  }

  /**
   * 处理 action 的回调函数
   */
  async handle(actionId, message) {
    console.log(
      "[EchoListener]",
      `handle actionId${actionId}, message: ${message}`
    );
    const {
      fromUserId,
      fromUsername,
      toRoomId,
      messageContentType,
      messageContent,
    } = message.appData.actionData;
    // 过滤自己的发言
    if (fromUserId === this.duoxingClient.duoxingConfig.userId) {
      return;
    }
    if (actionId === "userMessage") {
      const reply = await this.replyUser(
        messageContentType,
        messageContent,
        fromUserId,
        fromUsername
      );
      await this.duoxingClient.sendMsgToPerson(reply, fromUserId);
    } else if (actionId === "roomMessage") {
      const reply = await this.replyRoom(
        messageContentType,
        messageContent,
        fromUserId,
        fromUsername
      );
      await this.duoxingClient.sendMsgToRoom(reply, toRoomId);
    }
  }

  /**
   * 回复用户消息，可直接继承
   */
  replyUser(messageContentType, messageContent, fromUserId, fromUsername) {
    if (messageContentType !== "text") {
      return `你好呀，[${fromUsername}]，暂无法处理 ${messageContentType} 类型的消息`;
    }
    return `你好呀，[${fromUsername}]，你刚才发的消息是【${messageContent}】，机器人更多功能尽请期待~`;
  }

  /**
   * 回复群组消息，可直接继承
   */
  replyRoom(messageContentType, messageContent, fromUserId, fromUsername) {
    if (messageContentType !== "text") {
      return;
    }
    if (messageContent.includes("/hi")) {
      return `你好呀，[${fromUsername}]，你刚才发的消息是【${messageContent}】，机器人更多功能尽请期待~`;
    }
  }
}

module.exports = EchoListener;
