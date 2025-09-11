import React, { useState, useEffect, useRef } from 'react';
import { Alert, View } from 'react-native';
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Heading,
  Button,
  ButtonText,
  Text,
  CloseIcon,
  Icon,
  Input,
  InputField,
} from '@gluestack-ui/themed';

function Example() {
  const [showModal, setShowModal] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');

  return (
    <>
      <Button onPress={() => setShowModal(true)}>
        <ButtonText>Open Modal</ButtonText>
      </Button>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        size="md"
      >
        <ModalBackdrop />
        <ModalContent
          className="border-2 border-red-500 w-[120%] h-[250px]

        "
        >
          {/* absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 */}
          {/* <ModalHeader>
            <Heading size="lg">Modal Title</Heading>
            <ModalCloseButton>
              <Icon as={CloseIcon} />
            </ModalCloseButton>
          </ModalHeader> */}
          <ModalBody>
            <Text>This is the</Text>

            <Text
              size="sm"
              fontWeight="$medium"
              color="$gray700"
              style={{ marginTop: 16, marginBottom: 8 }}
            >
              Test Input
            </Text>
            <Input>
              <InputField
                placeholder="Enter some text..."
                value={inputValue}
                onChangeText={setInputValue}
                style={{ color: '#1f2937' }}
              />
            </Input>
          </ModalBody>
          {/* <ModalFooter>
            <Button
              variant="outline"
              action="secondary"
              style={{ marginRight: 12 }}
              onPress={() => {
                setShowModal(false);
              }}
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button
              onPress={() => {
                setShowModal(false);
              }}
            >
              <ButtonText>Save</ButtonText>
            </Button>
          </ModalFooter> */}
        </ModalContent>
      </Modal>
    </>
  );
}

export default Example;
