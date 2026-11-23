import ExpoModulesCore
import Foundation
#if os(iOS)
import UIKit
#endif

public class MacHostModule: Module {
  public func definition() -> ModuleDefinition {
    Name("MacHost")

    Constant("isiOSAppOnMac") { () -> Bool in
      #if os(iOS)
      if #available(iOS 14.0, *) {
        return ProcessInfo.processInfo.isiOSAppOnMac
      }
      #endif
      return false
    }

    #if os(iOS)
    View(MacKeyCatcher.self) {
      Events("onKey")
    }
    #endif
  }
}

#if os(iOS)
public final class MacKeyCatcher: ExpoView {
  let onKey = EventDispatcher()

  public required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
  }

  override public var keyCommands: [UIKeyCommand]? {
    let editing = findTextInput(in: window ?? self) != nil
    var specs: [(String, UIKeyModifierFlags)] = [
      (UIKeyCommand.inputEscape, []),
      ("f", .command),
    ]
    if !editing {
      specs.append(contentsOf: [
        (UIKeyCommand.inputUpArrow, []),
        (UIKeyCommand.inputDownArrow, []),
        (UIKeyCommand.inputLeftArrow, []),
        (UIKeyCommand.inputRightArrow, []),
        ("\r", []),
        (" ", []),
        ("\t", []),
      ])
    }
    return specs.map { input, flags in
      let command = UIKeyCommand(input: input, modifierFlags: flags, action: #selector(handleKey(_:)))
      if #available(iOS 15.0, *) {
        command.wantsPriorityOverSystemBehavior = true
      }
      return command
    }
  }

  @objc func handleKey(_ sender: UIKeyCommand) {
    let input = sender.input ?? ""
    if input == UIKeyCommand.inputEscape, let text = findTextInput(in: window ?? self) {
      text.resignFirstResponder()
      return
    }
    let name: String
    switch input {
    case UIKeyCommand.inputEscape: name = "escape"
    case UIKeyCommand.inputUpArrow: name = "up"
    case UIKeyCommand.inputDownArrow: name = "down"
    case UIKeyCommand.inputLeftArrow: name = "left"
    case UIKeyCommand.inputRightArrow: name = "right"
    case "\r": name = "enter"
    case " ": name = "space"
    case "\t": name = "tab"
    case "f": name = sender.modifierFlags.contains(.command) ? "find" : ""
    default: name = ""
    }
    if !name.isEmpty {
      onKey(["key": name])
    }
  }

  private func findTextInput(in view: UIView) -> UIView? {
    if view.isFirstResponder && (view is UITextField || view is UITextView) {
      return view
    }
    for child in view.subviews {
      if let found = findTextInput(in: child) { return found }
    }
    return nil
  }
}
#endif
