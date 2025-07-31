var password = "12345";
var friendNames = ["好友昵称1", "好友昵称2", "好友昵称3"];
var messageText = "OK"; // 要发送的文字消息

sleep(1000);
main();

function main() {
  if (!device.isScreenOn()) {
    device.wakeUp();
    sleep(1000);
    swipe(device.width / 2, device.height - 100, device.width / 2, 100, 500);
    sleep(1000);
    if (password) {
      for (var i = 0; i < password.length; i++) {
        clickWidgetByPosition(text(password[i]).untilFindOne());
      }
    }
    sleep(1000);
  }
  home();
  sleep(1000);

  toast("即将执行脚本，请勿操作手机");
  sleep(3000);
  setTimeout(() => exit(), 144 * 1000);

  device.setMusicVolume(0);
  sleep(500, 100);
  const douyinPackageName = app.getPackageName("抖音");
  app.launch(douyinPackageName);
  sleep(5000, 500);

  if (text("允许").clickable(true).exists()) {
    clickWidgetByPosition(text("允许").untilFindOne());
    sleep(1000);
  }
  closePopup();

  var messageTextWidget = text("消息")
    .className("android.widget.TextView")
    .untilFindOne();
  clickWidgetByPosition(messageTextWidget);
  sleep(3000, 100);
  closePopup();

  for (let i = 0; i < friendNames.length; i++) {
    let currentFriendName = friendNames[i];
    toast("正在给 " + currentFriendName + " 发送消息...");

    var friendWidget = text(currentFriendName).findOnce();
    if (!friendWidget) {
      swipe(
        device.width >> 1,
        device.height * 0.8,
        device.width >> 1,
        device.height * 0.2,
        400
      );
      sleep(2000, 500);
      friendWidget = text(currentFriendName).findOnce();
    }
    if (!friendWidget) {
      swipe(
        device.width >> 1,
        device.height * 0.1,
        device.width >> 1,
        device.height * 0.9,
        250
      );
      sleep(2000, 500);
      friendWidget = text(currentFriendName).findOnce();
    }
    if (!friendWidget) {
      toast("未找到好友：" + currentFriendName + "，跳过。");
      sleep(1000);
      continue;
    }

    clickWidgetByPosition(friendWidget);
    sleep(3000, 100);

    // 点击输入框
    var inputBox = className("android.widget.EditText").findOnce();
    if (inputBox) {
      clickWidgetByPosition(inputBox);
      sleep(1000, 200);
      
      // 输入文字
      inputBox.setText(messageText);
      sleep(1000, 200);
      
      // 点击发送按钮
      var sendButton = text("发送").findOnce() || desc("发送").findOnce();
      if (sendButton) {
        clickWidgetByPosition(sendButton);
      } else {
        // 如果找不到发送按钮，尝试按回车键
        keycode("KEYCODE_ENTER");
      }
      sleep(2000, 500);
    }

    // 总是返回好友列表，无论是否为最后一个好友
    back();
    sleep(2000, 500);
    
    // 多次尝试返回到消息列表页面
    var retryCount = 0;
    while (retryCount < 3 && !text("消息").exists()) {
      back();
      sleep(1500, 300);
      retryCount++;
    }
    
    // 确保已经回到消息列表页面
    if (text("消息").exists()) {
      sleep(1000, 200);
    } else {
      toast("无法返回消息列表，尝试重新进入");
      // 重新点击消息按钮
      var messageTextWidget = text("消息").className("android.widget.TextView").findOnce();
      if (messageTextWidget) {
        clickWidgetByPosition(messageTextWidget);
        sleep(2000, 300);
      }
    }
  }

  kill_app("抖音");
  exit();
}

function clickWidgetByPosition(widget) {
  while (widget && !widget.clickable()) {
    widget = widget.parent();
  }
  if (!widget) {
    console.error("无法找到可点击的父控件。");
    return;
  }
  const diffX = random(-5, 5);
  const diffY = random(-5, 5);
  click(widget.bounds().centerX() + diffX, widget.bounds().centerY() + diffY);
  sleep(500, 100);
}

function closePopup() {
  var btnClose = textMatches(/(.*拒绝.*|.*关闭.|.*以后再说.*)/).findOnce();
  if (btnClose) {
    clickWidgetByPosition(btnClose);
    sleep(1000, 500);
  }
}

function kill_app(appName) {
  var packageName = app.getPackageName(appName);
  if (!packageName) {
    console.error("未找到App包名：" + appName);
    return;
  }
  app.openAppSetting(packageName);
  sleep(3000);
  clickWidgetByPosition(textMatches(/(结束运行|强行停止)/).untilFindOne());
  sleep(1000);
  clickWidgetByPosition(textMatches(/(.*确.*|.*定.*)/).untilFindOne());
  sleep(1000);
  home();
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
