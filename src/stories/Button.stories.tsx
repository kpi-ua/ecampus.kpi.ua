import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { Button } from '../components/ui/button';
import ArrowsDownUpBold from '../app/images/icons/ArrowsDownUpBold.svg';
import ArrowsDownUpLight from '../app/images/icons/ArrowsDownUpLight.svg';
import ArrowsDownUpRegular from '../app/images/icons/ArrowsDownUpRegular.svg';
import ArrowSquareOutBold from '../app/images/icons/ArrowSquareOutBold.svg';
import ArrowSquareOutLight from '../app/images/icons/ArrowSquareOutLight.svg';
import ArrowSquareOutRegular from '../app/images/icons/ArrowSquareOutRegular.svg';
import Books from '../app/images/icons/Books.svg';
import CalendarBlank from '../app/images/icons/CalendarBlank.svg';
import Camera from '../app/images/icons/Camera.svg';
import CaretDownBold from '../app/images/icons/CaretDownBold.svg';
import CaretDownLight from '../app/images/icons/CaretDownLight.svg';
import CaretDownRegular from '../app/images/icons/CaretDownRegular.svg';
import CaretLeftBold from '../app/images/icons/CaretLeftBold.svg';
import CaretLeftLight from '../app/images/icons/CaretLeftLight.svg';
import CaretLeftRegular from '../app/images/icons/CaretLeftRegular.svg';
import CaretRightBold from '../app/images/icons/CaretRightBold.svg';
import CaretRightLight from '../app/images/icons/CaretRightLight.svg';
import CaretRightRegular from '../app/images/icons/CaretRightRegular.svg';
import CaretUpBold from '../app/images/icons/CaretUpBold.svg';
import CaretUpLight from '../app/images/icons/CaretUpLight.svg';
import CaretUpRegular from '../app/images/icons/CaretUpRegular.svg';
import ChartBarHorizontal from '../app/images/icons/ChartBarHorizontal.svg';
import ChatCenteredText from '../app/images/icons/ChatCenteredText.svg';
import Check from '../app/images/icons/Check.svg';
import CheckBold from '../app/images/icons/CheckBold.svg';
import CheckLight from '../app/images/icons/CheckLight.svg';
import CheckRegular from '../app/images/icons/CheckRegular.svg';
import ChecksBold from '../app/images/icons/ChecksBold.svg';
import ChecksLight from '../app/images/icons/ChecksLight.svg';
import ChecksRegular from '../app/images/icons/ChecksRegular.svg';
import CircleWavyCheck from '../app/images/icons/CircleWavyCheck.svg';
import CopyBold from '../app/images/icons/CopyBold.svg';
import CopyLight from '../app/images/icons/CopyLight.svg';
import CopyRegular from '../app/images/icons/CopyRegular.svg';
import CopySimple from '../app/images/icons/CopySimple.svg';
import DotsThreeBold from '../app/images/icons/DotsThreeBold.svg';
import DotsThreeDownBold from '../app/images/icons/DotsThreeDownBold.svg';
import DotsThreeDownLight from '../app/images/icons/DotsThreeDownLight.svg';
import DotsThreeDownRegular from '../app/images/icons/DotsThreeDownRegular.svg';
import DotsThreeLight from '../app/images/icons/DotsThreeLight.svg';
import DotsThreeRegular from '../app/images/icons/DotsThreeRegular.svg';
import Exam from '../app/images/icons/Exam.svg';
import EyeBold from '../app/images/icons/EyeBold.svg';
import EyeClosedBold from '../app/images/icons/EyeClosedBold.svg';
import EyeClosedLight from '../app/images/icons/EyeClosedLight.svg';
import EyeClosedRegular from '../app/images/icons/EyeClosedRegular.svg';
import EyeLight from '../app/images/icons/EyeLight.svg';
import EyeRegular from '../app/images/icons/EyeRegular.svg';
import EyeSlashBold from '../app/images/icons/EyeSlashBold.svg';
import EyeSlashLight from '../app/images/icons/EyeSlashLight.svg';
import EyeSlashRegular from '../app/images/icons/EyeSlashRegular.svg';
import FinnTheHumanBold from '../app/images/icons/FinnTheHumanBold.svg';
import FinnTheHumanLight from '../app/images/icons/FinnTheHumanLight.svg';
import FinnTheHumanRegular from '../app/images/icons/FinnTheHumanRegular.svg';
import Gear from '../app/images/icons/Gear.svg';
import GearBold from '../app/images/icons/GearBold.svg';
import GearLight from '../app/images/icons/GearLight.svg';
import GearRegular from '../app/images/icons/GearRegular.svg';
import GraduationCap from '../app/images/icons/GraduationCap.svg';
import House from '../app/images/icons/House.svg';
import IdentificationBadge from '../app/images/icons/IdentificationBadge.svg';
import Info from '../app/images/icons/Info.svg';
import Lifebuoy from '../app/images/icons/Lifebuoy.svg';
import ListNumbers from '../app/images/icons/ListNumbers.svg';
import MagnifyingGlassBold from '../app/images/icons/MagnifyingGlassBold.svg';
import MagnifyingGlassLight from '../app/images/icons/MagnifyingGlassLight.svg';
import MagnifyingGlassRegular from '../app/images/icons/MagnifyingGlassRegular.svg';
import MinusSquareBold from '../app/images/icons/MinusSquareBold.svg';
import MinusSquareLight from '../app/images/icons/MinusSquareLight.svg';
import MinusSquareRegular from '../app/images/icons/MinusSquareRegular.svg';
import Moon from '../app/images/icons/Moon.svg';
import MoonBold from '../app/images/icons/MoonBold.svg';
import MoonLight from '../app/images/icons/MoonLight.svg';
import MoonRegular from '../app/images/icons/MoonRegular.svg';
import Notebook from '../app/images/icons/Notebook.svg';
import PasswordBold from '../app/images/icons/PasswordBold.svg';
import PasswordLight from '../app/images/icons/PasswordLight.svg';
import PasswordRegular from '../app/images/icons/PasswordRegular.svg';
import PlusBold from '../app/images/icons/PlusBold.svg';
import PlusLight from '../app/images/icons/PlusLight.svg';
import PlusRegular from '../app/images/icons/PlusRegular.svg';
import PlusSquareBold from '../app/images/icons/PlusSquareBold.svg';
import PlusSquareLight from '../app/images/icons/PlusSquareLight.svg';
import PlusSquareRegular from '../app/images/icons/PlusSquareRegular.svg';
import Question from '../app/images/icons/Question.svg';
import Scroll from '../app/images/icons/Scroll.svg';
import SignOut from '../app/images/icons/SignOut.svg';
import Smiley from '../app/images/icons/Smiley.svg';
import SpinnerGap from '../app/images/icons/SpinnerGap.svg';
import SpinnerGapBold from '../app/images/icons/SpinnerGapBold.svg';
import SpinnerGapLight from '../app/images/icons/SpinnerGapLight.svg';
import SpinnerGapRegular from '../app/images/icons/SpinnerGapRegular.svg';
import Sun from '../app/images/icons/Sun.svg';
import SunBold from '../app/images/icons/SunBold.svg';
import SunLight from '../app/images/icons/SunLight.svg';
import SunRegular from '../app/images/icons/SunRegular.svg';
import Telegram from '../app/images/icons/Telegram.svg';
import UserCircle from '../app/images/icons/UserCircle.svg';
import VideoCamera from '../app/images/icons/VideoCamera.svg';
import Warning from '../app/images/icons/Warning.svg';
import WarningCircle from '../app/images/icons/WarningCircle.svg';
import X from '../app/images/icons/X.svg';
import XBold from '../app/images/icons/XBold.svg';
import XLight from '../app/images/icons/XLight.svg';
import XRegular from '../app/images/icons/XRegular.svg';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  // argTypes: {
  //   // backgroundColor: { control: 'color' },

  // },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithIcons: Story = {
  args: {
    className: "self-center justify-self-center",
    variant: 'secondary'
  },
  render: (args) => {
    return (
      <div className="grid grid-cols-3 gap-2">
        <Button {...args}>ArrowsDownUpBold <ArrowsDownUpBold /></Button>
        <Button {...args}>ArrowsDownUpLight <ArrowsDownUpLight /></Button>
        <Button {...args}>ArrowsDownUpRegular <ArrowsDownUpRegular /></Button>
        <Button {...args}>ArrowSquareOutBold <ArrowSquareOutBold /></Button>
        <Button {...args}>ArrowSquareOutLight <ArrowSquareOutLight /></Button>
        <Button {...args}>ArrowSquareOutRegular <ArrowSquareOutRegular /></Button>
        <Button {...args}>Books <Books /></Button>
        <Button {...args}>CalendarBlank <CalendarBlank /></Button>
        <Button {...args}>Camera <Camera /></Button>
        <Button {...args}>CaretDownBold <CaretDownBold /></Button>
        <Button {...args}>CaretDownLight <CaretDownLight /></Button>
        <Button {...args}>CaretDownRegular <CaretDownRegular /></Button>
        <Button {...args}>CaretLeftBold <CaretLeftBold /></Button>
        <Button {...args}>CaretLeftLight <CaretLeftLight /></Button>
        <Button {...args}>CaretLeftRegular <CaretLeftRegular /></Button>
        <Button {...args}>CaretRightBold <CaretRightBold /></Button>
        <Button {...args}>CaretRightLight <CaretRightLight /></Button>
        <Button {...args}>CaretRightRegular <CaretRightRegular /></Button>
        <Button {...args}>CaretUpBold <CaretUpBold /></Button>
        <Button {...args}>CaretUpLight <CaretUpLight /></Button>
        <Button {...args}>CaretUpRegular <CaretUpRegular /></Button>
        <Button {...args}>ChartBarHorizontal <ChartBarHorizontal /></Button>
        <Button {...args}>ChatCenteredText <ChatCenteredText /></Button>
        <Button {...args}>Check <Check /></Button>
        <Button {...args}>CheckBold <CheckBold /></Button>
        <Button {...args}>CheckLight <CheckLight /></Button>
        <Button {...args}>CheckRegular <CheckRegular /></Button>
        <Button {...args}>ChecksBold <ChecksBold /></Button>
        <Button {...args}>ChecksLight <ChecksLight /></Button>
        <Button {...args}>ChecksRegular <ChecksRegular /></Button>
        <Button {...args}>CircleWavyCheck <CircleWavyCheck /></Button>
        <Button {...args}>CopyBold <CopyBold /></Button>
        <Button {...args}>CopyLight <CopyLight /></Button>
        <Button {...args}>CopyRegular <CopyRegular /></Button>
        <Button {...args}>CopySimple <CopySimple /></Button>
        <Button {...args}>DotsThreeBold <DotsThreeBold /></Button>
        <Button {...args}>DotsThreeDownBold <DotsThreeDownBold /></Button>
        <Button {...args}>DotsThreeDownLight <DotsThreeDownLight /></Button>
        <Button {...args}>DotsThreeDownRegular <DotsThreeDownRegular /></Button>
        <Button {...args}>DotsThreeLight <DotsThreeLight /></Button>
        <Button {...args}>DotsThreeRegular <DotsThreeRegular /></Button>
        <Button {...args}>Exam <Exam /></Button>
        <Button {...args}>EyeBold <EyeBold /></Button>
        <Button {...args}>EyeClosedBold <EyeClosedBold /></Button>
        <Button {...args}>EyeClosedLight <EyeClosedLight /></Button>
        <Button {...args}>EyeClosedRegular <EyeClosedRegular /></Button>
        <Button {...args}>EyeLight <EyeLight /></Button>
        <Button {...args}>EyeRegular <EyeRegular /></Button>
        <Button {...args}>EyeSlashBold <EyeSlashBold /></Button>
        <Button {...args}>EyeSlashLight <EyeSlashLight /></Button>
        <Button {...args}>EyeSlashRegular <EyeSlashRegular /></Button>
        <Button {...args}>FinnTheHumanBold <FinnTheHumanBold /></Button>
        <Button {...args}>FinnTheHumanLight <FinnTheHumanLight /></Button>
        <Button {...args}>FinnTheHumanRegular <FinnTheHumanRegular /></Button>
        <Button {...args}>Gear <Gear /></Button>
        <Button {...args}>GearBold <GearBold /></Button>
        <Button {...args}>GearLight <GearLight /></Button>
        <Button {...args}>GearRegular <GearRegular /></Button>
        <Button {...args}>GraduationCap <GraduationCap /></Button>
        <Button {...args}>House <House /></Button>
        <Button {...args}>IdentificationBadge <IdentificationBadge /></Button>
        <Button {...args}>Info <Info /></Button>
        <Button {...args}>Lifebuoy <Lifebuoy /></Button>
        <Button {...args}>ListNumbers <ListNumbers /></Button>
        <Button {...args}>MagnifyingGlassBold <MagnifyingGlassBold /></Button>
        <Button {...args}>MagnifyingGlassLight <MagnifyingGlassLight /></Button>
        <Button {...args}>MagnifyingGlassRegular <MagnifyingGlassRegular /></Button>
        <Button {...args}>MinusSquareBold <MinusSquareBold /></Button>
        <Button {...args}>MinusSquareLight <MinusSquareLight /></Button>
        <Button {...args}>MinusSquareRegular <MinusSquareRegular /></Button>
        <Button {...args}>Moon <Moon /></Button>
        <Button {...args}>MoonBold <MoonBold /></Button>
        <Button {...args}>MoonLight <MoonLight /></Button>
        <Button {...args}>MoonRegular <MoonRegular /></Button>
        <Button {...args}>Notebook <Notebook /></Button>
        <Button {...args}>PasswordBold <PasswordBold /></Button>
        <Button {...args}>PasswordLight <PasswordLight /></Button>
        <Button {...args}>PasswordRegular <PasswordRegular /></Button>
        <Button {...args}>PlusBold <PlusBold /></Button>
        <Button {...args}>PlusLight <PlusLight /></Button>
        <Button {...args}>PlusRegular <PlusRegular /></Button>
        <Button {...args}>PlusSquareBold <PlusSquareBold /></Button>
        <Button {...args}>PlusSquareLight <PlusSquareLight /></Button>
        <Button {...args}>PlusSquareRegular <PlusSquareRegular /></Button>
        <Button {...args}>Question <Question /></Button>
        <Button {...args}>Scroll <Scroll /></Button>
        <Button {...args}>SignOut <SignOut /></Button>
        <Button {...args}>Smiley <Smiley /></Button>
        <Button {...args}>SpinnerGap <SpinnerGap /></Button>
        <Button {...args}>SpinnerGapBold <SpinnerGapBold /></Button>
        <Button {...args}>SpinnerGapLight <SpinnerGapLight /></Button>
        <Button {...args}>SpinnerGapRegular <SpinnerGapRegular /></Button>
        <Button {...args}>Sun <Sun /></Button>
        <Button {...args}>SunBold <SunBold /></Button>
        <Button {...args}>SunLight <SunLight /></Button>
        <Button {...args}>SunRegular <SunRegular /></Button>
        <Button {...args}>Telegram <Telegram /></Button>
        <Button {...args}>UserCircle <UserCircle /></Button>
        <Button {...args}>VideoCamera <VideoCamera /></Button>
        <Button {...args}>Warning <Warning /></Button>
        <Button {...args}>WarningCircle <WarningCircle /></Button>
        <Button {...args}>X <X /></Button>
        <Button {...args}>XBold <XBold /></Button>
        <Button {...args}>XLight <XLight /></Button>
        <Button {...args}>XRegular <XRegular /></Button>
      </div>
    );
  }
};

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary button'
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary button'
  },
};

export const tertiary: Story = {
  args: {
    variant: 'tertiary',
    children: 'Tertiary button'
  },
};

export const Big: Story = {
  args: {
    size: 'big',
    children: 'Big button'
  },
};

export const Medium: Story = {
  args: {
    size: 'medium',
    children: 'Medium button'
  },
};

export const Small: Story = {
  args: {
    size: 'small',
    children: 'Small button'
  },
};

export const Default_Disabled: Story = {
  args: {
    children: 'Disabled primary',
    disabled: true,
  }
};

export const Secondary_Disabled: Story = {
  args: {
    variant: 'secondary',
    children: 'Disabled secondary',
    disabled: true,
  }
};

export const Tertiary_Disabled: Story = {
  args: {
    variant: 'tertiary',
    children: 'Disabled tertiary',
    disabled: true,
  }
};

export const Primary_Icon: Story = {
  args: {
    children: <><Gear /></>
  }
};

export const Secondary_Icon: Story = {
  args: {
    variant: 'secondary',
    children: <><Gear /></>
  }
};

export const Tertiary_Icon: Story = {
  args: {
    variant: 'tertiary',
    children: <><Gear />Text</>
  }
};

export const Icon_Left_Text: Story = {
  args: {
    children: <><PlusRegular /> Left icon</>
  }
};

export const Icon_Right_Text: Story = {
  args: {
    children: <>Left right<CaretRightRegular /></>
  }
};